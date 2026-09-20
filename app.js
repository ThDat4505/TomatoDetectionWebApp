const video = document.getElementById('webcam');
const canvas = document.getElementById('output-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');

let session;
const modelPath = './best.onnx'; // Must be in the same folder

// 1. Initialize ONNX Runtime Session
async function loadModel() {
    try {
        // 'wasm' execution provider runs efficiently in the browser
        session = await ort.InferenceSession.create(modelPath, { executionProviders: ['wasm'] });
        console.log("ONNX Model loaded successfully.");
    } catch (err) {
        console.error("Failed to load model. Ensure best.onnx is in the directory.", err);
    }
}

// 2. Request Camera Permissions
startBtn.addEventListener('click', async () => {
    try {
        // Request video stream, preferring the back camera on mobile devices
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: 640, height: 640 },
            audio: false
        });
        
        video.srcObject = stream;
        startBtn.style.display = 'none'; // Hide button once camera is active

        // Wait for the video to load before starting the loop
        video.onloadedmetadata = () => {
            video.play();
            detectLoop();
        };
    } catch (err) {
        alert("Camera permission denied or no camera found on this device.");
        console.error("Camera error:", err);
    }
});

// 3. The Detection Loop
async function detectLoop() {
    // Draw the current video frame to the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (session) {
        // PRE-PROCESSING: (Conceptual)
        // In a full implementation, you must extract ImageData from the canvas,
        // normalize the RGB values (0-255 to 0.0-1.0), and convert them into a 
        // 1x3x640x640 Float32Array tensor required by YOLOv8.
        
        // INFERENCE:
        // const tensor = new ort.Tensor('float32', preprocessedData, [1, 3, 640, 640]);
        // const results = await session.run({ images: tensor });
        // const output = results[session.outputNames[0]];

        // POST-PROCESSING:
        // Parse 'output', apply Non-Maximum Suppression (NMS), 
        // and use ctx.strokeRect() and ctx.fillText() to draw boxes on the canvas.
    }

    // Call detectLoop again for the next frame
    requestAnimationFrame(detectLoop);
}

// Load the model as soon as the page opens
loadModel();