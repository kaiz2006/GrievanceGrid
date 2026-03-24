import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  const apiKey = "AIzaSyBNFOB2vhW2Z1IwEnuwiWvGi0kw0xKm3AI";
  if (!apiKey) {
    console.error("No API key");
    return;
  }
  
  // Directly fetch using REST to see list of models since SDK doesn't expose listModels well
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await response.json();
  
  if (data.error) {
     console.error("API error:", data.error);
  } else if (data.models) {
    console.log("AVAILABLE MODELS:");
    data.models.forEach((m) => {
      console.log(`- ${m.name} (methods: ${m.supportedGenerationMethods.join(", ")})`);
    });
  } else {
    console.log(data);
  }
}

run();
