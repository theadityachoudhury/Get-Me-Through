import { useRef, useEffect, useState } from "react";
import "../App.css";
import * as faceapi from "face-api.js";

function Test() {
	const videoRef = useRef();
	const canvasRef = useRef();
	const [isLive, setIsLive] = useState(false);

	useEffect(() => {
		startVideo();
		loadModels();
	}, []);

	const startVideo = () => {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((currentStream) => {
				videoRef.current.srcObject = currentStream;
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const loadModels = async () => {
		await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
		await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
		await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
		await faceapi.nets.faceExpressionNet.loadFromUri("/models");

		faceMyDetect();
	};

	const calculateEyeAspectRatio = (eye) => {
		// Implement your eye aspect ratio calculation here
		// Return the calculated eye aspect ratio
		const verticalDist1 = Math.sqrt(
			Math.pow(eye[1].x - eye[5].x, 2) + Math.pow(eye[1].y - eye[5].y, 2)
		);
		const verticalDist2 = Math.sqrt(
			Math.pow(eye[2].x - eye[4].x, 2) + Math.pow(eye[2].y - eye[4].y, 2)
		);
		const horizontalDist = Math.sqrt(
			Math.pow(eye[0].x - eye[3].x, 2) + Math.pow(eye[0].y - eye[3].y, 2)
		);

		const eyeAspectRatio =
			(verticalDist1 + verticalDist2) / (2 * horizontalDist);

		return eyeAspectRatio;
	};

	const performLivenessDetection = async () => {
		const canvas = canvasRef.current;

		if (!canvas) return;

		const detections = await faceapi
			.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
			.withFaceLandmarks()
			.withFaceExpressions();

		//   console.log(detections);

		if (detections.length === 0) {
			setIsLive(false); // No face detected, consider it not live
			return;
		}

		// Check for eye blinks
		const landmarks = detections[0].landmarks;

		const motionDetected = analyzeMotion(landmarks);
		const eyeDetected = eyeDetection(landmarks);

		// Analyze facial expressions
		const dynamicExpressionsDetected = analyzeFacialExpressions(detections);

		// Determine liveness based on motion, expressions, and texture
		console.log(motionDetected, dynamicExpressionsDetected, eyeDetected);
		if (eyeDetected && motionDetected && dynamicExpressionsDetected) {
			setIsLive(true); // Liveness detection successful
		} else {
			setIsLive(false); // Not live
		}
	};

	// Initialize the previous landmarks data to null
	let prevLandmarks = null;

	function eyeDetection(landmarks) {
		if (landmarks) {
			const leftEye = landmarks.getLeftEye();
			const rightEye = landmarks.getRightEye();

			const leftEyeAspectRatio = calculateEyeAspectRatio(leftEye);
			const rightEyeAspectRatio = calculateEyeAspectRatio(rightEye);

			const eyeAspectRatioThreshold = 0.2; // Adjust this threshold as needed
			console.log(leftEyeAspectRatio, rightEyeAspectRatio);

			if (
				leftEyeAspectRatio < eyeAspectRatioThreshold &&
				rightEyeAspectRatio < eyeAspectRatioThreshold
			) {
				return false;
			}
			return true;
		}
		return false;
	}

	// Define a function to analyze motion
	function analyzeMotion(currentLandmarks) {
		// Check if there are previous landmarks to compare with
		if (prevLandmarks) {
			// Calculate the motion by comparing current and previous landmarks
			const motionDetected = isMotionDetected(prevLandmarks, currentLandmarks);

			// Update the previous landmarks with the current ones for the next frame
			prevLandmarks = currentLandmarks;

			// Return true if motion is detected, false otherwise
			return motionDetected;
		}

		// If there are no previous landmarks, set the current landmarks as the previous ones
		prevLandmarks = currentLandmarks;

		// Return false as there's no previous frame to compare with
		return false;
	}

	// Function to check if motion is detected
	function isMotionDetected(prevLandmarks, currentLandmarks) {
		// Calculate the motion by comparing current and previous landmarks
		const motion = currentLandmarks._positions.map((currentPos, index) => {
			const prevPos = prevLandmarks._positions[index];
			const deltaX = currentPos._x - prevPos._x;
			const deltaY = currentPos._y - prevPos._y;
			return { x: deltaX, y: deltaY };
		});

		// Define a threshold for motion detection
		const motionThreshold = 1.0; // Adjust this threshold as needed

		// Check if any of the motion values exceed the threshold
		const isMotionDetected = motion.some((movement) => {
			return (
				Math.abs(movement.x) > motionThreshold ||
				Math.abs(movement.y) > motionThreshold
			);
		});

		// Return true if motion is detected, false otherwise
		return isMotionDetected;
	}

	// Define a function to check for dynamic facial expressions
	function analyzeFacialExpressions(detections) {
		if (detections.length === 0) {
			// No face detected, return false
			// console.log(here);
			return false;
		}

		// Get the first detected face
		const face = detections[0];
		// console.log(face);

		// Check for specific facial expressions
		const expressions = face.expressions;

		// You can adjust the threshold values as needed
		const expressionThreshold = 0.5;

		// Check for a smiling or angry expression
		const isNeutral = expressions["neutral"] > expressionThreshold;
		const isHappy = expressions["happy"] > expressionThreshold;
		const isSad = expressions["sad"] > expressionThreshold;
		const isAngry = expressions["Angry"] > expressionThreshold;
		const isFearful = expressions["fearful"] > expressionThreshold;
		const isdisgusted = expressions["disgusted"] > expressionThreshold;
		const issurprised = expressions["surprised"] > expressionThreshold;

		// Return true if either a smiling or angry expression is detected
		return (
			isNeutral ||
			isHappy ||
			isSad ||
			isAngry ||
			isFearful ||
			isdisgusted ||
			issurprised
		);
	}

	const faceMyDetect = () => {
		setInterval(async () => {
			performLivenessDetection();

			const detections = await faceapi
				.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
				.withFaceLandmarks()
				.withFaceExpressions();

			const canvas = canvasRef.current;

			if (canvas) {
				canvas.innerHTML = ""; // Clear the canvas

				faceapi.matchDimensions(canvas, {
					width: 940,
					height: 650,
				});

				const resized = faceapi.resizeResults(detections, {
					width: 940,
					height: 650,
				});

				// Draw detections without attempting to stringify the video element
				faceapi.draw.drawDetections(canvas, resized);
				faceapi.draw.drawFaceLandmarks(canvas, resized);
				faceapi.draw.drawFaceExpressions(canvas, resized);
			}
		}, 1000);
	};

	return (
		<div className="myapp">
			<h1>Liveness Detection</h1>
			<div className="appvide">
				<video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
			</div>
			<canvas ref={canvasRef} width="940" height="650" className="appcanvas" />
			<p>{isLive ? "Live" : "Not Live"}</p>
		</div>
	);
}

export default Test;
