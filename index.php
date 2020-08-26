<!DOCTYPE html>
<html>
<head>
<title>SimpleWebRTC Demo</title>
<link rel="stylesheet" href="./style.scss">
</head>
<body>
	<div class="earth"></div>
	<div class="container_p">
		<h2 id="title" class="area">Start a Room</h2>
		<hr />
		<!-- <div class="screenShareButton"></div> -->
		<!-- <p id="subTitle">(https required for screensaring to work)</p> -->
		<br />
		<p><button id="start">Start Capture</button>&nbsp;<button id="stop">Stop Capture</button></p>
		<input id="cod_sesion" class="cod_session" placeholder="https required for screensaring to work" />
		<div class="btn btn-lg btn-create" onclick="create_newroom()"><span>crear nueva sala</span></div>
		<div class="communication" style="display: flex;margin-top: 300px;">
			<video id="localVideo" autoplay style="height: 150px;"></video>
			<div class="loading">
				<svg version="1.2" height="300" width="530" xmlns="http://www.w3.org/2000/svg" viewport="0 0 60 60"
					xmlns:xlink="http://www.w3.org/1999/xlink">
					<path id="pulsar" stroke="rgba(0,155,155,1)" fill="none" stroke-width="1" stroke-linejoin="round"
						d="M0,90L250,90Q257,60 262,87T267,95 270,88 273,92t6,35 7,-60T290,127 297,107s2,-11 10,-10 1,1 8,-10T319,95c6,4 8,-6 10,-17s2,10 9,11h210" />
				</svg>
			</div>
			<video id="remoteVideo" autoplay style="height: 150px;"></video>
		</div>
	</div>
	
</body>
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="latest-v2.js"></script>
<script src="videocall.js"></script>
</html>