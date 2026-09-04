import logging
import urllib.request
import json
import os
from typing import Optional, Dict, Any, Tuple
from twilio.twiml.voice_response import VoiceResponse, Gather, Say, Pause, Hangup
from twilio.rest import Client
from app.core.config import settings

logger = logging.getLogger(__name__)

class VoiceNotificationService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID", settings.twilio_account_sid)
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN", settings.twilio_auth_token)
        self.from_number = os.getenv("TWILIO_FROM_NUMBER", settings.twilio_from_number)
        self.client: Optional[Client] = None
        
        if self.account_sid and self.auth_token:
            try:
                self.client = Client(self.account_sid, self.auth_token)
                logger.info("Twilio Voice Client initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Twilio client: {e}")

    def get_public_webhook_url(self) -> str:
        """Dynamically detect ngrok public HTTPS URL or use configured base URL."""
        env_url = os.getenv("TWILIO_WEBHOOK_BASE_URL")
        if env_url:
            return env_url.rstrip("/")

        try:
            with urllib.request.urlopen("http://127.0.0.1:4040/api/tunnels", timeout=1.5) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                for t in data.get("tunnels", []):
                    if t.get("public_url", "").startswith("https://"):
                        return t.get("public_url")
        except Exception:
            pass

        return "https://dropper-gainfully-staff.ngrok-free.dev"

    def get_voice_and_lang(self, language: str) -> Tuple[str, str]:
        lang = language.lower().strip()
        if lang in ("hi", "hindi"):
            return "Polly.Aditi", "hi-IN"
        elif lang in ("kn", "kannada"):
            return "Google.kn-IN-Standard-A", "kn-IN"
        elif lang in ("mr", "marathi"):
            return "Google.mr-IN-Standard-A", "mr-IN"
        elif lang in ("ta", "tamil"):
            return "Google.ta-IN-Standard-A", "ta-IN"
        else:
            return "Polly.Aditi", "en-IN"

    def trigger_trusted_circle_call(
        self,
        senior_phone: str,
        senior_name: str,
        guardian_name: str,
        recipient_name: str,
        amount: float,
        transfer_id: str,
        language: str = "en"
    ) -> Dict[str, Any]:
        """Dispatch an outbound Trusted Circle verification call from Guardian to Senior via Twilio."""
        if not self.client:
            return {
                "success": False,
                "error": "Twilio client not initialized. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN."
            }

        voice_name, lang_code = self.get_voice_and_lang(language)
        public_base = self.get_public_webhook_url()
        import urllib.parse
        q_senior = urllib.parse.quote(senior_name)
        q_guardian = urllib.parse.quote(guardian_name)
        q_recip = urllib.parse.quote(recipient_name)
        webhook_action = (
            f"{public_base}/api/v1/cases/voice/webhook/trusted-circle-respond?"
            f"transfer_id={transfer_id}&senior_name={q_senior}&guardian_name={q_guardian}&"
            f"recipient_name={q_recip}&amount={amount}&lang={language}&turn=1"
        )

        lang = language.lower().strip()
        amt_str = f"{int(amount):,}"
        if lang in ("hi", "hindi"):
            script_text = (
                f"नमस्ते {senior_name} जी! यह बैंकमंत्री फैमिली शील्ड से वॉयस वेरिफिकेशन कॉल है। "
                f"आपके ट्रस्टेड गार्डियन {guardian_name} ने {recipient_name} को {amt_str} रुपये ट्रांसफर करने का अलर्ट देखा है। "
                f"क्या आप सचमुच यह {amt_str} रुपये भेजना चाहते हैं? "
                f"पुष्टि करने के लिए 'हाँ' कहें, या कैंसिल करने के लिए 'नहीं' कहें।"
            )
            fallback_msg = "क्षमा करें, मुझे आपकी आवाज सुनाई नहीं दी। कृपया बाद में दोबारा प्रयास करें। धन्यवाद।"
        elif lang in ("kn", "kannada"):
            script_text = (
                f"ನಮಸ್ಕಾರ {senior_name} ಅವರೇ! ಇದು ಬ್ಯಾಂಕ್‌ಸಾಥಿ ಫ್ಯಾಮಿಲಿ ಶೀಲ್ಡ್ ವಾಯ್ಸ್ ಪರಿಶೀಲನೆ ಕರೆ. "
                f"ನಿಮ್ಮ ಗಾರ್ಡಿಯನ್ {guardian_name} ಅವರು {recipient_name} ಅವರಿಗೆ {amt_str} ರೂಪಾಯಿ ಕಳುಹಿಸುವ ವಹಿವಾಟನ್ನು ಗಮನಿಸಿದ್ದಾರೆ. "
                f"ನೀವು ನಿಜವಾಗಿಯೂ ಈ ಹಣವನ್ನು ಕಳುಹಿಸುತ್ತಿದ್ದೀರಾ? "
                f"ದೃಢೀಕರಿಸಲು 'ಹೌದು' ಅಥವಾ ರದ್ದುಗೊಳಿಸಲು 'ಇಲ್ಲ' ಎಂದು ಹೇಳಿ."
            )
            fallback_msg = "ಕ್ಷಮಿಸಿ, ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ಧನ್ಯವಾದಗಳು."
        elif lang in ("mr", "marathi"):
            script_text = (
                f"नमस्कार {senior_name} जी! हे बँकसाथी फॅमिली शील्ड कडून व्हॉइस व्हेरिफिकेशन कॉल आहे. "
                f"तुमचे पालक {guardian_name} यांनी {recipient_name} यांना {amt_str} रुपयांच्या ट्रान्सफरचा अलर्ट पाहिला आहे. "
                f"तुम्ही स्वतः हे पैसे पाठवत आहात का? "
                f"पुष्टी करण्यासाठी 'होय' म्हणा किंवा रद्द करण्यासाठी 'नाही' म्हणा."
            )
            fallback_msg = "क्षमस्व, आवाज ऐकू आला नाही. धन्यवाद."
        elif lang in ("ta", "tamil"):
            script_text = (
                f"வணக்கம் {senior_name}! இது பேங்க் சாதி குடும்ப பாதுகாப்பு குரல் சரிபார்ப்பு அழைப்பு. "
                f"உங்கள் பாதுகாவலர் {guardian_name}, {recipient_name} க்கு {amt_str} ரூபாய் பரிவர்த்தனை பற்றி சரிபார்க்க கோரியுள்ளார். "
                f"நீங்கள் உண்மையிலேயே இந்த பணத்தை அனுப்புகிறீர்களா? "
                f"உறுதிப்படுத்த 'ஆம்' அல்லது ரத்து செய்ய 'இல்லை' என்று சொல்லுங்கள்."
            )
            fallback_msg = "மன்னிக்கவும், உங்கள் குரல் கேட்கவில்லை. நன்றி."
        else:
            script_text = (
                f"Hello {senior_name}! This is BankMantri Family Shield voice verification. "
                f"Your trusted guardian {guardian_name} noticed a transfer of {amt_str} rupees to {recipient_name}. "
                f"Are you sending this money yourself? "
                f"Please say 'Yes' to confirm, or 'No' to cancel."
            )
            fallback_msg = "I did not hear a response. Please verify in your banking app. Goodbye!"

        vr = VoiceResponse()
        vr.pause(length=1)
        gather = Gather(
            input="speech",
            action=webhook_action,
            method="POST",
            speech_timeout="auto",
            timeout=6,
            language=lang_code
        )
        gather.say(script_text, voice=voice_name, language=lang_code)
        vr.append(gather)
        vr.say(fallback_msg, voice=voice_name, language=lang_code)

        try:
            call = self.client.calls.create(
                twiml=str(vr),
                to=senior_phone,
                from_=self.from_number
            )
            logger.info(f"Trusted Circle verification call dispatched to {senior_phone}. Call SID: {call.sid}")
            return {
                "success": True,
                "call_sid": call.sid,
                "status": call.status,
                "senior_phone": senior_phone,
                "from_phone": self.from_number,
                "language": language,
                "transfer_id": transfer_id,
                "script_spoken": script_text,
                "interactive_webhook": webhook_action
            }
        except Exception as e:
            logger.error(f"Failed to dispatch Trusted Circle Twilio call: {e}")
            return {
                "success": False,
                "error": str(e),
                "senior_phone": senior_phone,
                "language": language,
                "script_spoken": script_text
            }

    def generate_initial_script(
        self,
        customer_name: str,
        status: str,
        case_id: str,
        summary: str,
        primary_recommendation: str,
        language: str = "en"
    ) -> str:
        """Initial greeting + assessment explanation + invitation to ask queries."""
        lang = language.lower().strip()
        
        if lang in ("hi", "hindi"):
            if "RESTRUCTURE" in primary_recommendation.upper() or "DISTRESS" in status.upper() or "WORKOUT" in primary_recommendation.upper():
                return (
                    f"नमस्ते {customer_name} जी! मैं आपके बैंक से AI फाइनेंशियल सेफ्टी कोपायलट बोल रहा हूँ। "
                    f"हम आपके खाते की सुरक्षा और सहायता के लिए संपर्क कर रहे हैं। "
                    f"आपके कैशफ्लो को आसान बनाने के लिए हमारे पास एक विशेष राहत और ऋण पुनर्गठन योजना उपलब्ध है। "
                    f"आप बिना किसी पेनल्टी के अपनी मासिक ईएमआई को आसान किस्तों में बदल सकते हैं। "
                    f"क्या आपके पास इस योजना के बारे में कोई प्रश्न या सवाल है, या क्या आप इसके नियम जानना चाहते हैं? कृपया बोलकर बताएं, मैं सुन रहा हूँ।"
                )
            elif "FRAUD" in primary_recommendation.upper() or "STEP_UP" in primary_recommendation.upper() or "FLAG" in status.upper():
                return (
                    f"नमस्ते {customer_name} जी! यह आपके बैंक से एक महत्वपूर्ण सुरक्षा अलर्ट है। "
                    f"आपके खाते पर एक असामान्य लेनदेन का प्रयास देखा गया है और सुरक्षा कारणों से इसे होल्ड किया गया है। "
                    f"क्या आपने हाल ही में कोई नया लेनदेन करने की कोशिश की थी, या क्या आपको इस संबंध में कोई सहायता चाहिए? कृपया बोलकर बताएं।"
                )
            elif "APPROVE" in primary_recommendation.upper() or "APPROVED" in status.upper():
                return (
                    f"बधाई हो {customer_name} जी! मैं आपके बैंक से AI फाइनेंशियल कोपायलट बोल रहा हूँ। "
                    f"आपके उत्कृष्ट वित्तीय ट्रैक रिकॉर्ड के आधार पर आपकी नई क्रेडिट सुविधा को स्वीकृत कर दिया गया है। "
                    f"क्या आप इसकी ब्याज दर या डिस्बर्समेंट प्रक्रिया के बारे में कुछ पूछना चाहते हैं? कृपया बोलकर बताएं।"
                )
            else:
                return (
                    f"नमस्ते {customer_name} जी! आपके बैंक खाते के मूल्यांकन पर एक नया अपडेट आया है। "
                    f"क्या आपके पास इस विषय में कोई प्रश्न या सवाल है? कृपया बोलकर बताएं, मैं आपकी सहायता के लिए तैयार हूँ।"
                )

        elif lang in ("kn", "kannada"):
            if "RESTRUCTURE" in primary_recommendation.upper() or "DISTRESS" in status.upper() or "WORKOUT" in primary_recommendation.upper():
                return (
                    f"ನಮಸ್ಕಾರ {customer_name} ಅವರೇ! ನಾನು ನಿಮ್ಮ ಬ್ಯಾಂಕ್‌ನ AI ಫೈನಾನ್ಷಿಯಲ್ ಸೇಫ್ಟಿ ಕೋಪೈಲಟ್‌ನಿಂದ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. "
                    f"ನಿಮ್ಮ ಖಾತೆಯ ಹಣಕಾಸಿನ ನೆರವಿಗಾಗಿ ನಾವು ಕರೆ ಮಾಡುತ್ತಿದ್ದೇವೆ. "
                    f"ನಿಮ್ಮ ಮಾಸಿಕ ಪಾವತಿಗಳನ್ನು ಸುಲಭಗೊಳಿಸಲು ವಿಶೇಷ ಸಾಲ ಮರುಹೊಂದಾಣಿಕೆ ಯೋಜನೆ ಲಭ್ಯವಿದೆ. "
                    f"ನಿಮಗೆ ಈ ಯೋಜನೆ ಅಥವಾ ಬಡ್ಡಿ ದರದ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ? ದಯವಿಟ್ಟು ಮಾತನಾಡಿ ತಿಳಿಸಿ, ನಾನು ಕೇಳುತ್ತಿದ್ದೇನೆ."
                )
            elif "FRAUD" in primary_recommendation.upper() or "STEP_UP" in primary_recommendation.upper() or "FLAG" in status.upper():
                return (
                    f"ಎಚ್ಚರಿಕೆ {customer_name} ಅವರೇ! ಇದು ನಿಮ್ಮ ಬ್ಯಾಂಕ್‌ನಿಂದ ತುರ್ತು ಭದ್ರತಾ ಕರೆ. "
                    f"ನಿಮ್ಮ ಖಾತೆಯಲ್ಲಿ ಅಸಾಮಾನ್ಯ ವಹಿವಾಟು ಪತ್ತೆಯಾಗಿದ್ದು, ಅದನ್ನು ತಾತ್ಕಾಲಿಕವಾಗಿ ತಡೆಹಿಡಿಯಲಾಗಿದೆ. "
                    f"ನೀವು ಈ ವಹಿವಾಟನ್ನು ಮಾಡಿದ್ದೀರಾ, ಅಥವಾ ಯಾವುದೇ ಸಹಾಯ ಬೇಕೇ? ದಯವಿಟ್ಟು ಮಾತನಾಡಿ ತಿಳಿಸಿ."
                )
            elif "APPROVE" in primary_recommendation.upper() or "APPROVED" in status.upper():
                return (
                    f"ಅಭಿನಂದನೆಗಳು {customer_name} ಅವರೇ! ನಿಮ್ಮ ಬ್ಯಾಂಕ್‌ನಿಂದ AI ಫೈನಾನ್ಷಿಯಲ್ ಕೋಪೈಲಟ್ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. "
                    f"ನಿಮ್ಮ ಸಾಲದ ಸೌಲಭ್ಯವನ್ನು ಅನುಮೋದಿಸಲಾಗಿದೆ. "
                    f"ಈ ಸೌಲಭ್ಯದ ಬಗ್ಗೆ ನಿಮಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ? ದಯವಿಟ್ಟು ಮಾತನಾಡಿ ತಿಳಿಸಿ."
                )
            else:
                return (
                    f"ನಮಸ್ಕಾರ {customer_name} ಅವರೇ! ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಹೊಸ ಅಪ್‌ಡೇಟ್ ಬಂದಿದೆ. "
                    f"ನಿಮಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ? ದಯವಿಟ್ಟು ಮಾತನಾಡಿ ತಿಳಿಸಿ."
                )

        elif lang in ("mr", "marathi"):
            if "RESTRUCTURE" in primary_recommendation.upper() or "DISTRESS" in status.upper() or "WORKOUT" in primary_recommendation.upper():
                return (
                    f"नमस्कार {customer_name} जी! मी आपल्या बँकेचा AI फायनान्शियल सेफ्टी कोपायलट बोलत आहे. "
                    f"आम्ही आपल्या खात्याच्या आर्थिक साहाय्यासाठी आणि सुरक्षिततेसाठी संपर्क करत आहोत. "
                    f"आपला मासिक हप्ता सुलभ करण्यासाठी विशेष कर्ज पुनर्रचना आणि व्याज सवलत योजना उपलब्ध आहे. "
                    f"या योजनेबद्दल आपले काही प्रश्न किंवा शंका आहेत का? कृपया बोलून सांगा, मी ऐकत आहे."
                )
            elif "FRAUD" in primary_recommendation.upper() or "STEP_UP" in primary_recommendation.upper() or "FLAG" in status.upper():
                return (
                    f"नमस्कार {customer_name} जी! हा आपल्या बँकेकडून महत्त्वाचा सुरक्षा अलर्ट आहे. "
                    f"आपल्या खात्यावर एका नवीन डिव्हाइसवरून संशयास्पद व्यवहार आढळला असून सुरक्षेच्या कारणास्तव तो तात्पुरता रोखण्यात आला आहे. "
                    f"आपण हा व्यवहार केला होता का? कृपया बोलून सांगा."
                )
            elif "APPROVE" in primary_recommendation.upper() or "APPROVED" in status.upper():
                return (
                    f"अभिनंदन {customer_name} जी! मी आपल्या बँकेचा AI लेंडिंग कोपायलट बोलत आहे. "
                    f"आपल्या उत्तम क्रेडिट रेकॉर्डच्या आधारे आपल्या कर्ज सुविधेला मंजुरी मिळाली आहे. "
                    f"या योजनेबद्दल आपल्याला काही विचारायचे आहे का? कृपया बोला."
                )
            else:
                return (
                    f"नमस्कार {customer_name} जी! आपल्या बँक खात्याच्या मूल्यांकनाबाबत नवीन माहिती उपलब्ध आहे. "
                    f"आपल्याला काही विचारायचे असल्यास कृपया बोलून सांगा."
                )

        elif lang in ("ta", "tamil"):
            if "RESTRUCTURE" in primary_recommendation.upper() or "DISTRESS" in status.upper() or "WORKOUT" in primary_recommendation.upper():
                return (
                    f"வணக்கம் {customer_name}! நான் உங்கள் வங்கியின் AI நிதி பாதுகாப்பு கோபிலட் (Financial Safety Copilot) பேசுகிறேன். "
                    f"உங்கள் கணக்கின் நிதி நிலையை எளிதாக்க நாங்கள் இந்த முன்னெச்சரிக்கை அழைப்பை மேற்கொண்டுள்ளோம். "
                    f"உங்கள் மாதாந்திர தவணையை எளிதாக்க சிறப்பு கடன் மறுசீரமைப்பு திட்டம் மற்றும் வட்டி சலுகை கிடைக்கிறது. "
                    f"இந்த திட்டம் குறித்து உங்களுக்கு ஏதேனும் கேள்விகள் உள்ளதா? அல்லது கூடுதல் விவரங்கள் அறிய விரும்புகிறீர்களா? தயவுசெய்து சொல்லுங்கள், நான் கேட்கிறேன்."
                )
            elif "FRAUD" in primary_recommendation.upper() or "STEP_UP" in primary_recommendation.upper() or "FLAG" in status.upper():
                return (
                    f"வணக்கம் {customer_name}! இது உங்கள் வங்கியின் AI பாதுகாப்பு அமைப்பிலிருந்து அவசர பாதுகாப்பு எச்சரிக்கை. "
                    f"உங்கள் கணக்கில் புதிய சாதனத்திலிருந்து சந்தேகத்திற்குரிய பரிவர்த்தனை முயற்சி கண்டறியப்பட்டு தற்காலிகமாக நிறுத்தப்பட்டுள்ளது. "
                    f"நீங்கள் இந்த பரிவர்த்தனையை செய்தீர்களா? அல்லது கணக்கை பாதுகாக்க உதவி தேவையா? தயவுசெய்து பேசுங்கள்."
                )
            elif "APPROVE" in primary_recommendation.upper() or "APPROVED" in status.upper():
                return (
                    f"வாழ்த்துகள் {customer_name}! நான் உங்கள் வங்கியின் AI கடன் கோபிலட் பேசுகிறேன். "
                    f"உங்களின் சிறந்த கடன் வரலாற்றை முன்னிட்டு உங்கள் கடன் கோரிக்கை அங்கீகரிக்கப்பட்டுள்ளது. "
                    f"வட்டி விகிதம் அல்லது கடன் வழங்கல் குறித்து ஏதேனும் கேள்விகள் உள்ளதா? தயவுசெய்து பேசுங்கள்."
                )
            else:
                return (
                    f"வணக்கம் {customer_name}! உங்கள் வங்கிக் கணக்கு மதிப்பீடு குறித்து புதிய தகவல் உள்ளது. "
                    f"உங்களுக்கு ஏதேனும் கேள்விகள் உள்ளதா? தயவுசெய்து சொல்லுங்கள்."
                )

        else: # Default: English
            if "RESTRUCTURE" in primary_recommendation.upper() or "DISTRESS" in status.upper() or "WORKOUT" in primary_recommendation.upper():
                return (
                    f"Hello {customer_name}! This is your AI Financial Safety Copilot calling from your bank. "
                    f"We are reaching out with proactive support regarding your recent account review. "
                    f"To assist with your monthly cashflow, you have been pre-approved for a non-punitive debt restructuring plan with reduced interest. "
                    f"Do you have any questions about this repayment plan, or would you like more details on how it works? Please speak after the tone, I am listening."
                )
            elif "FRAUD" in primary_recommendation.upper() or "STEP_UP" in primary_recommendation.upper() or "FLAG" in status.upper():
                return (
                    f"Hello {customer_name}! This is an urgent security notification from your bank's AI Fraud Defense System. "
                    f"We detected an unverified transaction attempt from a new device, and placed a temporary protective hold. "
                    f"Did you recently attempt this transfer, or would you like help securing your account? Please speak after the tone."
                )
            elif "APPROVE" in primary_recommendation.upper() or "APPROVED" in status.upper():
                return (
                    f"Congratulations {customer_name}! This is your AI Lending Copilot calling from your bank. "
                    f"Your credit application has been approved with prime preferred rates. "
                    f"Do you have any questions regarding your interest rate or disbursement steps? Please feel free to speak now."
                )
            else:
                return (
                    f"Hello {customer_name}! This is your AI Financial Safety Copilot with an update on case {case_id}. "
                    f"Do you have any questions or queries regarding your account assessment? Please speak after the tone."
                )

    def trigger_voice_call(
        self,
        to_phone: str,
        customer_name: str,
        status: str,
        case_id: str,
        summary: str,
        primary_recommendation: str,
        language: str = "en",
        custom_script: Optional[str] = None
    ) -> Dict[str, Any]:
        """Dispatch a 2-way interactive phone call with conversational Gather speech webhook."""
        if not self.client:
            return {
                "success": False,
                "error": "Twilio client not initialized. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN."
            }

        voice_name, lang_code = self.get_voice_and_lang(language)
        public_base = self.get_public_webhook_url()
        webhook_action = f"{public_base}/api/v1/cases/voice/webhook/respond?case_id={case_id}&lang={language}&turn=1"

        script_text = custom_script or self.generate_initial_script(
            customer_name=customer_name,
            status=status,
            case_id=case_id,
            summary=summary,
            primary_recommendation=primary_recommendation,
            language=language
        )

        # 2-Way Interactive TwiML built with official VoiceResponse
        vr = VoiceResponse()
        vr.pause(length=1)
        gather = Gather(
            input="speech",
            action=webhook_action,
            method="POST",
            speech_timeout="auto",
            timeout=6,
            language=lang_code
        )
        gather.say(script_text, voice=voice_name, language=lang_code)
        vr.append(gather)
        
        fallback_msg = (
            "क्षमा करें, मुझे आपकी आवाज सुनाई नहीं दी। यदि आपका कोई प्रश्न है तो आप हमारे बैंकिंग ऐप पर कभी भी संपर्क कर सकते हैं। धन्यवाद और अलविदा!"
            if language in ("hi", "hindi")
            else (
                "ಕ್ಷಮಿಸಿ, ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ನಿಮ್ಮ ಬ್ಯಾಂಕಿಂಗ್ ಆ್ಯಪ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ. ಧನ್ಯವಾದಗಳು!"
                if language in ("kn", "kannada")
                else (
                    "क्षमस्व, आवाज ऐकू आला नाही. अधिक माहितीसाठी आपल्या बँकिंग ॲपवर संपर्क साधा. धन्यवाद!"
                    if language in ("mr", "marathi")
                    else (
                        "மன்னிக்கவும், உங்கள் குரல் கேட்கவில்லை. கூடுதல் விவரங்களுக்கு வங்கி செயலியை தொடர்பு கொள்ளவும். நன்றி!"
                        if language in ("ta", "tamil")
                        else "I did not hear a response. If you have any further questions, you can always reach us in your banking app. Thank you and goodbye!"
                    )
                )
            )
        )
        vr.say(fallback_msg, voice=voice_name, language=lang_code)

        try:
            call = self.client.calls.create(
                twiml=str(vr),
                to=to_phone,
                from_=self.from_number
            )
            logger.info(f"Interactive 2-way Twilio call dispatched to {to_phone}. Call SID: {call.sid}")
            return {
                "success": True,
                "call_sid": call.sid,
                "status": call.status,
                "to_phone": to_phone,
                "from_phone": self.from_number,
                "language": language,
                "interactive_webhook": webhook_action,
                "script_spoken": script_text
            }
        except Exception as e:
            logger.error(f"Failed to dispatch Twilio call: {e}")
            return {
                "success": False,
                "error": str(e),
                "to_phone": to_phone,
                "language": language,
                "script_spoken": script_text
            }

    def get_latest_policy_summary(self, policy_store=None) -> str:
        """Find the latest or custom policy document in the knowledge base."""
        if not policy_store or not policy_store.documents:
            return "Institutional Banking Underwriting and Restructuring Policy"
        for doc in reversed(policy_store.documents):
            source = doc.metadata.get("source_file", "")
            title = source.replace(".md", "").replace("_", " ").title()
            if title and not source.startswith("contract_"):
                return title
        return "Institutional Banking Underwriting and Restructuring Policy"

    async def search_and_explain_policy(
        self,
        query: str,
        language: str = "en",
        policy_store=None
    ) -> Optional[str]:
        """Search policy store and synthesize a clean spoken explanation for text-to-speech."""
        if not policy_store:
            return None
        try:
            results = await policy_store.search(query, k=3)
            if not results:
                return None
            
            # Pick the most relevant document
            doc = results[0]
            raw_title = doc.metadata.get("source_file", "Bank Policy").replace(".md", "").replace("_", " ").title()
            clause_name = doc.metadata.get("clause", "Policy Guidelines")
            
            # Clean snippet for TTS: remove markdown and metadata headers
            clean_lines = []
            for line in doc.page_content.split("\n"):
                line = line.strip()
                if not line or line.startswith(("#", "Category:", "Status:", "Jurisdiction:", "**Category", "**Status", "**Jurisdiction", "---")):
                    continue
                clean_lines.append(line.replace("*", "").replace("`", "").replace(">", "").strip())
            
            clean_text = " ".join(clean_lines).strip()
            # Extract 1-2 key sentences
            sentences = [s.strip() for s in clean_text.split(".") if len(s.strip()) > 10]
            summary_snippet = ". ".join(sentences[:2]) if sentences else clean_text[:160]
            if summary_snippet and not summary_snippet.endswith("."):
                summary_snippet += "."
                
            lang = language.lower().strip()
            if lang in ("hi", "hindi"):
                return f"हमारी बैंक पॉलिसी '{raw_title}' के अनुसार: {summary_snippet} क्या आप इस नई पॉलिसी या ऋण सुविधा के बारे में कुछ और पूछना चाहते हैं?"
            elif lang in ("kn", "kannada"):
                return f"ನಮ್ಮ ಹೊಸ ಬ್ಯಾಂಕ್ ಪಾಲಿಸಿ '{raw_title}' ಪ್ರಕಾರ: {summary_snippet} ನೀವು ಈ ಸೌಲಭ್ಯವನ್ನು ಪಡೆಯಲು ಬಯಸುವಿರಾ?"
            else:
                return f"According to our institutional policy '{raw_title}': {summary_snippet} Would you like to proceed with this plan or have our loan officer assist you?"
        except Exception as e:
            logger.error(f"Error searching policy in voice service: {e}")
            return None

    async def generate_conversational_reply(
        self,
        case_id: str,
        user_speech: str,
        language: str = "en",
        turn: int = 1,
        policy_store=None
    ) -> Tuple[str, bool]:
        """Generate empathetic AI conversational answer to user's question, searching live policies in real time."""
        speech_lower = user_speech.lower().strip()
        lang = language.lower().strip()

        # Check for goodbye / termination intent
        if any(w in speech_lower for w in ["bye", "goodbye", "no thanks", "nothing else", "धन्यवाद", "अलविदा", "बस", "ಇಲ್ಲ", "ಸಾಕು", "ಧನ್ಯವಾದ", "stop", "done", "no", "nahi"]):
            if lang in ("hi", "hindi"):
                return ("बहुत बहुत धन्यवाद! आपकी सहायता करके खुशी हुई। सुरक्षित रहें और आपका दिन शुभ हो। अलविदा!", False)
            elif lang in ("kn", "kannada"):
                return ("ತುಂಬಾ ಧನ್ಯವಾದಗಳು! ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಮಗೆ ಸಂತೋಷವಾಗಿದೆ. ಶುಭ ದಿನ, ನಮಸ್ಕಾರ!", False)
            else:
                return ("Thank you very much for speaking with us today. Have a wonderful and safe day. Goodbye!", False)

        # Check for policy inquiry keywords to trigger live RAG search
        policy_keywords = ["policy", "rule", "guideline", "scheme", "restructure", "moratorium", "emi", "interest", "relief", "पॉलिसी", "नियम", "योजना", "ಸಾಲ", "ನಿಯಮ", "ಪಾಲಿಸಿ"]
        if any(pk in speech_lower for pk in policy_keywords) and policy_store:
            policy_explanation = await self.search_and_explain_policy(user_speech, language, policy_store)
            if policy_explanation:
                return (policy_explanation, True)

        # Hindi Conversational Responses
        if lang in ("hi", "hindi"):
            if any(w in speech_lower for w in ["emi", "ब्याज", "interest", "दर", "rate", "किस्त", "रुपए", "पैसा"]):
                return ("जी हाँ, इस योजना में आपकी मासिक ईएमआई लगभग पच्चीस प्रतिशत तक कम हो जाएगी और ब्याज दर पर भी विशेष छूट दी जाएगी। क्या आप इस योजना को अभी अपने खाते में एक्टिवेट करना चाहते हैं, या कोई और सवाल है?", True)
            elif any(w in speech_lower for w in ["officer", "manager", "बात", "agent", "इंसान", "human", "मैनेजर"]):
                return ("बिल्कुल! मैं आपके नजदीकी ब्रांच रिलेशनशिप मैनेजर को आपका केस फॉरवर्ड कर रहा हूँ। वे आज ही आपको कॉल करके पूरी प्रक्रिया पूरी करवाएंगे। क्या इसके अलावा कोई और प्रश्न है?", True)
            elif any(w in speech_lower for w in ["fraud", "धोखा", "ओटीपी", "otp", "hold", "कार्ड"]):
                return ("आप बिल्कुल निश्चिंत रहें। आपके खाते की पूरी सुरक्षा की जा रही है। संदिग्ध लेनदेन को रोक दिया गया है और आपका फंड सुरक्षित है। क्या आप चाहते हैं कि हम आपका कार्ड दोबारा जारी करें?", True)
            elif any(w in speech_lower for w in ["हाँ", "yes", "कर दो", "approve", "स्वीकृत", "agree"]):
                return ("बहुत बढ़िया! मैंने आपका अनुरोध दर्ज कर लिया है। आपके बैंकिंग ऐप पर एक कन्फर्मेशन लिंक भेजा गया है। क्या मैं आपकी किसी अन्य विषय में सहायता कर सकता हूँ?", True)
            else:
                return (f"मैंने समझा कि आप पूछ रहे हैं: '{user_speech}'। हमारी बैंकिंग पॉलिसी के अनुसार, यह सुविधा आपकी वित्तीय सुरक्षा को ध्यान में रखकर तैयार की गई है। क्या आप चाहते हैं कि हमारे बैंक मैनेजर आपसे सीधे संपर्क करें?", True)

        # Kannada Conversational Responses
        elif lang in ("kn", "kannada"):
            if any(w in speech_lower for w in ["emi", "ಬಡ್ಡಿ", "interest", "rate", "ಹಣ", "loan", "ಸಾಲ"]):
                return ("ಹೌದು, ಈ ಹೊಸ ಮರುಹೊಂದಾಣಿಕೆ ಯೋಜನೆಯಲ್ಲಿ ನಿಮ್ಮ ಮಾಸಿಕ EMI ಕಡಿಮೆಯಾಗುತ್ತದೆ ಮತ್ತು ಬಡ್ಡಿದರದಲ್ಲಿ ವಿಶೇಷ ರಿಯಾಯಿತಿ ಸಿಗುತ್ತದೆ. ನೀವು ಈ ಯೋಜನೆಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಬಯಸುವಿರಾ?", True)
            elif any(w in speech_lower for w in ["officer", "manager", "ಮಾತನಾಡು", "agent", "ಅಧಿಕಾರಿ"]):
                return ("ಖಂಡಿತವಾಗಿಯೂ! ನಮ್ಮ ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿಗಳಿಗೆ ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸುತ್ತಿದ್ದೇವೆ, ಅವರು ಶೀಘ್ರದಲ್ಲೇ ನಿಮಗೆ ಕರೆ ಮಾಡುತ್ತಾರೆ. ಇನ್ನೇನಾದರೂ ಮಾಹಿತಿ ಬೇಕೇ?", True)
            elif any(w in speech_lower for w in ["yes", "ಹೌದು", "ಸರಿ", "ಮಾಡಿಕೊಡಿ"]):
                return ("ತುಂಬಾ ಸಂತೋಷ! ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ವಿವರಗಳು ನಿಮ್ಮ ಮೊಬೈಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಆ್ಯಪ್‌ನಲ್ಲಿ ಲಭ್ಯವಿವೆ. ಇನ್ನೇನಾದರೂ ಸಹಾಯ ಬೇಕೇ?", True)
            else:
                return (f"ನೀವು ಕೇಳಿದ್ದನ್ನು ನಾನು ಗಮನಿಸಿದ್ದೇನೆ. ನಿಮ್ಮ ಖಾತೆಯ ಸಂಪೂರ್ಣ ಸುರಕ್ಷತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ನಮ್ಮ ತಂಡ ಸಿದ್ಧವಿದೆ. ನಮ್ಮ ಬ್ಯಾಂಕ್ ಮ್ಯಾನೇಜರ್ ನಿಮಗೆ ಕರೆ ಮಾಡಬೇಕೇ?", True)

        # English Conversational Responses
        else:
            if any(w in speech_lower for w in ["emi", "interest", "rate", "cost", "money", "payment", "how much"]):
                return ("Under this relief program, your monthly obligation will be restructured over a 36-month fixed horizon, reducing your monthly payments by up to 25% with zero penalties. Would you like to proceed with this plan?", True)
            elif any(w in speech_lower for w in ["officer", "human", "agent", "manager", "speak", "person", "representative"]):
                return ("Certainly! I have notified our dedicated Relationship Officer, and they will connect with you shortly to assist with your account. Is there anything else I can clarify in the meantime?", True)
            elif any(w in speech_lower for w in ["fraud", "scam", "hold", "security", "unauthorized", "stolen", "card"]):
                return ("Rest assured, your balance is completely safe. The suspicious transfer was held by our proactive defense system before any funds were released. Would you like us to issue a new secure card or reset your credentials?", True)
            elif any(w in speech_lower for w in ["yes", "approve", "confirm", "accept", "proceed", "agree"]):
                return ("Excellent! Your confirmation has been securely recorded in our system. An official confirmation summary has also been dispatched to your mobile app. Is there anything else I can assist you with today?", True)
            else:
                return (f"Thank you for sharing that regarding: '{user_speech}'. Our institutional guidelines are designed to protect your financial safety while offering flexible assistance. Would you like our senior officer to follow up directly with you?", True)

voice_service = VoiceNotificationService()
