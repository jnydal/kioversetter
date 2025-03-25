import { useRef, useState } from "react"; // add useEffect later
import { useDispatch } from "react-redux";
import { setTranscript, toggleRecording } from "../store";
import axios from "axios";

const useSpeech = () => {
  const dispatch = useDispatch();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        audioChunks.current = [];

        // Send to Azure Speech-to-Text API
        const formData = new FormData();
        formData.append("file", audioBlob);

        try {
          const response = await axios.post(
            "YOUR_AZURE_SPEECH_TO_TEXT_ENDPOINT",
            formData,
            {
              headers: {
                "Ocp-Apim-Subscription-Key": "YOUR_AZURE_API_KEY",
                "Content-Type": "audio/wav",
              },
            }
          );
          dispatch(setTranscript(response.data.transcription));
        } catch (error) {
          console.error("Speech recognition error", error);
        }
      };

      mediaRecorder.current.start();
      dispatch(toggleRecording(true));
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      dispatch(toggleRecording(false));
      setIsRecording(false);
    }
  };

  return { isRecording, startRecording, stopRecording };
};

export default useSpeech;
