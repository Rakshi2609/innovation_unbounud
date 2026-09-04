import logging
from typing import Optional, Dict, Any
from twilio.rest import Client
from app.core.config import settings

logger = logging.getLogger(__name__)

class VoiceNotificationService:
    def __init__(self):
        self.account_sid = settings.twilio_account_sid
        self.auth_token = settings.twilio_auth_token
        self.from_number = settings.twilio_from_number
        self.client: Optional[Client] = None
        
        if self.account_sid and self.auth_token:
            try:
                self.client = Client(self.account_sid, self.auth_token)
                logger.info("Twilio Voice Client initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Twilio client: {e}")

    def generate_script(
        self,
        customer_name: str,
        status: str,
        case_id: str,
        summary: str,
        primary_recommendation: str,
        language: str = "en"
    ) -> str:
        """Generate a polite, friendly, empathetic banking voice call script in the requested language."""
        lang = language.lower().strip()
        
        if lang in ("hi", "hindi"):
            if "RESTRUCTURE" in primary_recommendation.upper() or "DISTRESS" in status.upper() or "WORKOUT" in primary_recommendation.upper():
                return (
                    f"नमस्ते {customer_name} जी! मैं आपके बैंक से AI फाइनेंशियल सेफ्टी कोपायलट बोल रहा हूँ। "
                    f"हम आपके खाते की सुरक्षा और सहायता के लिए संपर्क कर रहे हैं। "
                    f"आपके कैशफ्लो को आसान बनाने के लिए हमारे पास एक विशेष राहत और ऋण पुनर्गठन योजना उपलब्ध है। "
                    f"आप बिना किसी पेनल्टी के अपनी मासिक ईएमआई को आसान किस्तों में बदल सकते हैं। "
                    f"कृपया अपने बैंकिंग ऐप में लॉगिन करके विवरण देखें या हमारे रिलेशनशिप मैनेजर से बात करें। धन्यवाद और आपका दिन शुभ हो!"
                )
            elif "FRAUD" in primary_recommendation.upper() or "STEP_UP" in primary_recommendation.upper() or "FLAG" in status.upper():
                return (
                    f"नमस्ते {customer_name} जी! यह आपके बैंक से एक महत्वपूर्ण सुरक्षा अलर्ट है। "
                    f"आपके खाते पर एक असामान्य लेनदेन का प्रयास देखा गया है। "
                    f"आपकी सुरक्षा के लिए इस लेनदेन को अस्थायी रूप से रोक दिया गया है। "
                    f"कृपया तुरंत अपने बैंकिंग ऐप पर जाकर बायोमेट्रिक या ओटीपी सत्यापन पूरा करें। "
                    f"बैंक कभी भी आपका पासवर्ड नहीं पूछता। धन्यवाद!"
                )
            elif "APPROVE" in primary_recommendation.upper() or "APPROVED" in status.upper():
                return (
                    f"बधाई हो {customer_name} जी! मैं आपके बैंक से AI फाइनेंशियल कोपायलट बोल रहा हूँ। "
                    f"आपके उत्कृष्ट वित्तीय ट्रैक रिकॉर्ड के आधार पर आपकी नई क्रेडिट सुविधा को सफलतापूर्वक स्वीकृत कर दिया गया है। "
                    f"आपकी स्वीकृत राशि आपके खाते में सक्रिय करने के लिए तैयार है। "
                    f"अधिक जानकारी के लिए कृपया अपने बैंकिंग ऐप पर जाएँ। धन्यवाद!"
                )
            else:
                return (
                    f"नमस्ते {customer_name} जी! आपके बैंक खाते से जुड़े मूल्यांकन पर एक नया अपडेट आया है। "
                    f"हमारी टीम ने आपकी वित्तीय सुरक्षा के लिए सिफारिशें तैयार की हैं। "
                    f"कृपया अपने बैंकिंग ऐप पर जाकर पूरा विवरण देखें। धन्यवाद!"
                )

        elif lang in ("kn", "kannada"):
            if "RESTRUCTURE" in primary_recommendation.upper() or "DISTRESS" in status.upper() or "WORKOUT" in primary_recommendation.upper():
                return (
                    f"ನಮಸ್ಕಾರ {customer_name} ಅವರೇ! ನಾನು ನಿಮ್ಮ ಬ್ಯಾಂಕ್‌ನ AI ಫೈನಾನ್ಷಿಯಲ್ ಸೇಫ್ಟಿ ಕೋಪೈಲಟ್‌ನಿಂದ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. "
                    f"ನಿಮ್ಮ ಖಾತೆಯ ಹಣಕಾಸಿನ ನೆರವಿಗಾಗಿ ನಾವು ಕರೆ ಮಾಡುತ್ತಿದ್ದೇವೆ. "
                    f"ನಿಮ್ಮ ಮಾಸಿಕ ಪಾವತಿಗಳನ್ನು ಸುಲಭಗೊಳಿಸಲು ವಿಶೇಷ ಸಾಲ ಮರುಹೊಂದಾಣಿಕೆ ಯೋಜನೆ ಲಭ್ಯವಿದೆ. "
                    f"ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ದಯವಿಟ್ಟು ಬ್ಯಾಂಕಿಂಗ್ ಆ್ಯಪ್ ಪರಿಶೀಲಿಸಿ. ಧನ್ಯವಾದಗಳು!"
                )
            elif "FRAUD" in primary_recommendation.upper() or "STEP_UP" in primary_recommendation.upper() or "FLAG" in status.upper():
                return (
                    f"ಎಚ್ಚರಿಕೆ {customer_name} ಅವರೇ! ಇದು ನಿಮ್ಮ ಬ್ಯಾಂಕ್‌ನಿಂದ ತುರ್ತು ಭದ್ರತಾ ಕರೆ. "
                    f"ನಿಮ್ಮ ಖಾತೆಯಲ್ಲಿ ಅಸಾಮಾನ್ಯ ವಹಿವಾಟು ಪತ್ತೆಯಾಗಿದೆ. "
                    f"ನಿಮ್ಮ ಖಾತೆಯ ಸುರಕ್ಷತೆಗಾಗಿ ಈ ವಹಿವಾಟನ್ನು ತಡೆಹಿಡಿಯಲಾಗಿದೆ. "
                    f"ದಯವಿಟ್ಟು ತಕ್ಷಣ ನಿಮ್ಮ ಬ್ಯಾಂಕಿಂಗ್ ಆ್ಯಪ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ. ಧನ್ಯವಾದಗಳು!"
                )
            elif "APPROVE" in primary_recommendation.upper() or "APPROVED" in status.upper():
                return (
                    f"ಅಭಿನಂದನೆಗಳು {customer_name} ಅವರೇ! ನಿಮ್ಮ ಬ್ಯಾಂಕ್‌ನಿಂದ AI ಫೈನಾನ್ಷಿಯಲ್ ಕೋಪೈಲಟ್ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. "
                    f"ನಿಮ್ಮ ಅತ್ಯುತ್ತಮ ಕ್ರೆಡಿಟ್ ಇತಿಹಾಸದ ಆಧಾರದ ಮೇಲೆ ನಿಮ್ಮ ಸಾಲದ ಸೌಲಭ್ಯವನ್ನು ಅನುಮೋದಿಸಲಾಗಿದೆ. "
                    f"ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ನಿಮ್ಮ ಮೊಬೈಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಆ್ಯಪ್ ತೆರೆಯಿರಿ. ಧನ್ಯವಾದಗಳು!"
                )
            else:
                return (
                    f"ನಮಸ್ಕಾರ {customer_name} ಅವರೇ! ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಹೊಸ ಅಪ್‌ಡೇಟ್ ಬಂದಿದೆ. "
                    f"ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬ್ಯಾಂಕಿಂಗ್ ಆ್ಯಪ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ. ಧನ್ಯವಾದಗಳು!"
                )

        else: # Default: English
            if "RESTRUCTURE" in primary_recommendation.upper() or "DISTRESS" in status.upper() or "WORKOUT" in primary_recommendation.upper():
                return (
                    f"Hello {customer_name}! This is your AI Financial Safety Copilot calling from your bank. "
                    f"We are reaching out with proactive support regarding your recent account review. "
                    f"To assist with your monthly cashflow, you have been pre-approved for a non-punitive debt restructuring and repayment plan with lower interest. "
                    f"Please log in to your banking portal or speak with our officer to activate your customized plan. Thank you and take care!"
                )
            elif "FRAUD" in primary_recommendation.upper() or "STEP_UP" in primary_recommendation.upper() or "FLAG" in status.upper():
                return (
                    f"Hello {customer_name}! This is an urgent security notification from your bank's AI Fraud Defense System. "
                    f"We detected an unverified transaction attempt on your account from a new device. "
                    f"As a precaution, a temporary security hold has been placed. "
                    f"Please open your mobile banking application immediately to confirm or cancel this activity. Thank you."
                )
            elif "APPROVE" in primary_recommendation.upper() or "APPROVED" in status.upper():
                return (
                    f"Congratulations {customer_name}! This is your AI Lending Copilot from your bank. "
                    f"Based on your strong credit profile and verified income, your credit application has been officially approved with prime rates. "
                    f"Your facility is now ready for disbursement in your banking portal. Thank you for banking with us!"
                )
            else:
                return (
                    f"Hello {customer_name}! This is your AI Financial Safety Copilot calling with an update regarding your case {case_id}. "
                    f"{summary} Our officers have prepared tailored next steps for you. "
                    f"Please check your mobile banking portal for full details. Thank you!"
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
        """Dispatch a live phone call via Twilio with friendly multilingual speech."""
        if not self.client:
            return {
                "success": False,
                "error": "Twilio client not initialized. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN."
            }

        script_text = custom_script or self.generate_script(
            customer_name=customer_name,
            status=status,
            case_id=case_id,
            summary=summary,
            primary_recommendation=primary_recommendation,
            language=language
        )

        lang_code = "en-IN"
        voice_name = "Polly.Aditi"

        if language.lower() in ("hi", "hindi"):
            lang_code = "hi-IN"
            voice_name = "Polly.Aditi"
        elif language.lower() in ("kn", "kannada"):
            lang_code = "kn-IN"
            voice_name = "Polly.Aditi"

        # Construct clean TwiML payload
        twiml = f"""<Response>
    <Pause length="1"/>
    <Say voice="{voice_name}" language="{lang_code}">
        {script_text}
    </Say>
    <Pause length="1"/>
    <Say voice="{voice_name}" language="en-IN">
        Thank you for choosing AI Financial Safety and Resilience. Goodbye!
    </Say>
</Response>"""

        try:
            call = self.client.calls.create(
                twiml=twiml,
                to=to_phone,
                from_=self.from_number
            )
            logger.info(f"Twilio call dispatched to {to_phone}. Call SID: {call.sid}")
            return {
                "success": True,
                "call_sid": call.sid,
                "status": call.status,
                "to_phone": to_phone,
                "from_phone": self.from_number,
                "language": language,
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

voice_service = VoiceNotificationService()
