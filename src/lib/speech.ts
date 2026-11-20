// Web Speech API Helper for Speech-to-Text & Text-to-Speech

export class SpeechEngine {
  private static recognition: any = null;
  private static synth: SpeechSynthesis | null = null;
  private static isSpeaking = false;

  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  public static isTextToSpeechSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  // Text-To-Speech: AI speaks the question
  public static speak(
    text: string, 
    onStart?: () => void, 
    onEnd?: () => void
  ): void {
    if (typeof window === 'undefined') return;
    
    // Stop any ongoing speech
    this.stopSpeaking();

    const synth = window.speechSynthesis;
    if (!synth) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Pick natural English voice if available
    const voices = synth.getVoices();
    const naturalVoice = voices.find(v => 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David')) &&
      v.lang.startsWith('en')
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    synth.speak(utterance);
  }

  public static stopSpeaking(): void {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (synth && synth.speaking) {
      synth.cancel();
      this.isSpeaking = false;
    }
  }

  // Speech-To-Text: Candidate voice input
  public static startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): any {
    if (typeof window === 'undefined') return null;

    const SpeechRecognitionAPI = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      if (onError) onError('Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return null;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        onResult(finalTranscript || interimTranscript, !!finalTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (onError) onError(event.error);
      };

      recognition.onend = () => {
        if (onEnd) onEnd();
      };

      recognition.start();
      return recognition;
    } catch (err: any) {
      if (onError) onError(err.message || 'Error starting speech recognition');
      return null;
    }
  }

  public static stopListening(recognitionInstance: any): void {
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {
        // Already stopped
      }
    }
  }
}
