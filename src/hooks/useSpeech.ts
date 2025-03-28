import { useRef, useState } from "react";
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
          sendAudioChunks();  // Send each chunk as it becomes available
        }
      };

      mediaRecorder.current.onstop = () => {
        // Handle any cleanup if needed after stopping
      };

      mediaRecorder.current.start(500);  // Start recording and send every 500ms
      dispatch(toggleRecording(true));
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone", error);
    }
  };

  const sendAudioChunks = async () => {
    if (audioChunks.current.length > 0) {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      audioChunks.current = [];

      try {
        const formData = new FormData();
        formData.append("file", audioBlob);

        const azureSpeechFunctionUrl = process.env.REACT_APP_AZURE_SPEECH_FUNCTION_KEY as string;
        if (!azureSpeechFunctionUrl) {
          throw new Error("Azure Function Key is missing...");
        }

        const response = await axios.post(
          azureSpeechFunctionUrl, // Replace with your Azure function URL
          formData,
          {
            headers: {
              "Content-Type": "audio/wav",
            },
          }
        );

        // Assuming the response contains the transcript text from your Azure function
        dispatch(setTranscript(response.data)); // Set the transcription
      } catch (error) {
        console.error("Error sending audio to Azure function", error);
      }
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    dispatch(toggleRecording(false));
    setIsRecording(false);
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};

export default useSpeech;
