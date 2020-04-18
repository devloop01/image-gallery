import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const Modal = ({ imageData, onModalActive }) => {
	const { urls, alt_description, color, links, height, width, created_at, exif } = imageData;

	const date = new Date(created_at);

	const [dropdownActive, setDropdownActive] = useState(false);
	const [infoActive, setInfoActive] = useState(false);
	const [views, setViews] = useState(0);
	const [downloads, setDownloads] = useState(0);
	const [likes, setLikes] = useState(0);
	const [viewsLastMonth, setViewsLastMonth] = useState(0);
	const [downloadsLastMonth, setDownloadsLastMonth] = useState(0);
	const [likesLastMonth, setLikesLastMonth] = useState(0);

	const modalEl = useRef();
	const imageEl = useRef();

	const handleClose = () => {
		modalEl.current.style.display = "none";
		onModalActive(false);
		document.title = "Image Gallery | UNSPLASH";
	};

	const handleDropdown = () => {
		setDropdownActive(!dropdownActive);
	};

	const fetchStats = () => {
		axios(`${process.env.REACT_APP_API_URL}/photos/${imageData.id}/statistics`, {
			params: {
				client_id: process.env.REACT_APP_CLIENT_ID,
			},
		}).then((res) => {
			// get all the values in an array
			const lastMonthViewValues = res.data.views.historical.values.map((e) => e.value);
			const lastMonthDownloadValues = res.data.downloads.historical.values.map(
				(e) => e.value
			);
			const lastMonthLikeValues = res.data.likes.historical.values.map((e) => e.value);

			// add up the array
			const lastMonthTotalViews = numberFormatter(returnTotal(lastMonthViewValues), 1);
			const lastMonthTotalDownloads = numberFormatter(
				returnTotal(lastMonthDownloadValues),
				1
			);
			const lastMonthTotalLikes = numberFormatter(returnTotal(lastMonthLikeValues), 1);

			// set all the values
			setViews(res.data.views.total);
			setDownloads(res.data.downloads.total);
			setLikes(res.data.likes.total);
			setViewsLastMonth(lastMonthTotalViews);
			setDownloadsLastMonth(lastMonthTotalDownloads);
			setLikesLastMonth(lastMonthTotalLikes);
		});
	};

	useEffect(fetchStats, []);

	return (
		<div className="modal" ref={modalEl}>
			<div
				className="image-container"
				style={{
					background: color,
					height: width / height > 2 ? "50%" : "80%",
				}}
			>
				<img src={urls.full} alt={alt_description} ref={imageEl} />
				<button className="btn close" onClick={handleClose}>
					<div className="icon">
						<svg
							viewBox="0 0 512 512"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="false"
						>
							<path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" />
						</svg>
					</div>
				</button>

				<div className="options--container">
					<div className="group g-1">
						<a href={`${links.download}?force=true`} className="download">
							download
						</a>
						<div className="dropdown-btn--container">
							<button className="btn dropdown" onClick={handleDropdown}>
								<div className="icon">
									<svg viewBox="0 0 32 32" aria-hidden="false">
										<path d="M9.9 11.5l6.1 6.1 6.1-6.1 1.9 1.9-8 8-8-8 1.9-1.9z"></path>
									</svg>
								</div>
							</button>
							<div className={`dropdown-menu ${dropdownActive ? "" : "hide"}`}>
								<ul>
									<li>
										<a href={`${links.download}?force=true&w=640`}>
											Small <span>(640x960)</span>
										</a>
									</li>
									<li>
										<a href={`${links.download}?force=true&w=1920`}>
											Medium <span>(1920x2880)</span>
										</a>
									</li>
									<li>
										<a href={`${links.download}?force=true&w=2400`}>
											Large <span>(2400x3600)</span>
										</a>
									</li>
									<li>
										<a href={`${links.download}?force=true`}>
											Original Size{" "}
											<span>
												({height}x{width})
											</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="group g-2">
						<button className="btn info" onClick={() => setInfoActive(true)}>
							<div className="icon">
								<svg
									viewBox="0 0 512 512"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
								>
									<path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>
								</svg>
							</div>
						</button>
					</div>
				</div>

				<div
					className="image-info--container"
					style={{
						display: infoActive ? "flex" : "none",
					}}
				>
					<div
						className="image-info--modal"
						style={{
							backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), white 150px), url("${urls.thumb}&auto=format&fit=crop&w=200&q=60&blur=20")`,
						}}
					>
						<button className="btn close" onClick={() => setInfoActive(false)}>
							<div className="icon">
								<svg
									viewBox="0 0 512 512"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="false"
								>
									<path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" />
								</svg>
							</div>
						</button>

						<div className="row row--1">
							<h1>Info</h1>
							<span>
								Published on {months[date.getMonth()]} {date.getDate()},{" "}
								{date.getFullYear()}
							</span>
						</div>
						<div className="row row--2">
							<div className="image-info views--container">
								<div className="info">
									<div className="icon">
										<svg
											version="1.1"
											viewBox="0 0 32 32"
											width="32"
											height="32"
											aria-hidden="false"
										>
											<path d="M31.8 15.1l-.2-.4c-3.5-6.9-9.7-11.5-15.6-11.5-6.3 0-12.3 4.5-15.7 11.7l-.2.4c-.2.5-.2 1.1 0 1.6l.2.4c3.6 7 9.7 11.5 15.6 11.5 6.3 0 12.3-4.5 15.6-11.6l.2-.4c.4-.5.4-1.2.1-1.7zm-2 1.2c-3 6.5-8.3 10.5-13.8 10.5-5.2 0-10.6-4.1-13.8-10.4l-.2-.4.1-.3c3.1-6.5 8.4-10.5 13.9-10.5 5.2 0 10.6 4.1 13.8 10.4l.2.4-.2.3zm-13.8-6.6c-3.5 0-6.3 2.8-6.3 6.3s2.8 6.3 6.3 6.3 6.3-2.8 6.3-6.3-2.8-6.3-6.3-6.3zm0 10.6c-2.4 0-4.3-1.9-4.3-4.3s1.9-4.3 4.3-4.3 4.3 1.9 4.3 4.3-1.9 4.3-4.3 4.3z"></path>
										</svg>
									</div>
									<span className="info--title">Views</span>
								</div>
								<div className="info info--value">
									<span className="total-views">{beautifyNumber(views)}</span>
								</div>
								<div className="monthly-stats">
									<span className="views-stat">+{viewsLastMonth}</span> since last
									month
								</div>
							</div>
							<div className="image-info downloads--container">
								<div className="info">
									<div className="icon">
										<svg
											version="1.1"
											viewBox="0 0 32 32"
											width="32"
											height="32"
											aria-hidden="false"
										>
											<path d="M27.5 18.08a1 1 0 0 0-1.42 0l-9.08 8.59v-23.67a1 1 0 0 0-2 0v23.67l-9.08-8.62a1 1 0 1 0-1.38 1.45l10.77 10.23a1.19 1.19 0 0 0 .15.09.54.54 0 0 0 .16.1.94.94 0 0 0 .76 0 .54.54 0 0 0 .16-.1l.15-.09 10.77-10.23a1 1 0 0 0 .04-1.42z"></path>
										</svg>
									</div>
									<span className="info info--title">Downloads</span>
								</div>
								<div className="info info--value">
									<span className="total-views">{beautifyNumber(downloads)}</span>
								</div>
								<div className="monthly-stats">
									<span className="downloads-stat">+{downloadsLastMonth}</span>{" "}
									since last month
								</div>
							</div>
							<div className="image-info likes--container">
								<div className="info">
									<div className="icon">
										<svg
											version="1.1"
											viewBox="0 -4 32 40"
											width="32"
											height="32"
											aria-hidden="false"
										>
											<path d="M17.4 29c-.8.8-2 .8-2.8 0l-12.3-12.8c-3.1-3.1-3.1-8.2 0-11.4 3.1-3.1 8.2-3.1 11.3 0l2.4 2.8 2.3-2.8c3.1-3.1 8.2-3.1 11.3 0 3.1 3.1 3.1 8.2 0 11.4l-12.2 12.8z"></path>
										</svg>
									</div>
									<span className="info info--title">Likes</span>
								</div>
								<div className="info info--value">
									<span className="total-views">{beautifyNumber(likes)}</span>
								</div>
								<div className="monthly-stats">
									<span className="likes-stat">+{likesLastMonth}</span> since last
									month
								</div>
							</div>
						</div>
						<div className="hr-line"></div>
						<div className="row row--3">
							<div className="camera-info">
								<span className="info--title">Camera Make</span>
								<span className="info--value">
									{exif !== undefined ? exif.make : "--"}
								</span>
							</div>
							<div className="camera-info">
								<span className="info--title">Camera Model</span>
								<span className="info--value">
									{exif !== undefined ? exif.model : "--"}
								</span>
							</div>
							<div className="camera-info">
								<span className="info--title">Focal Length</span>
								<span className="info--value">
									{exif !== undefined ? `${exif.focal_length}mm` : "--"}
								</span>
							</div>
							<div className="camera-info">
								<span className="info--title">Aperture</span>
								<span className="info--value">
									{exif !== undefined ? `ƒ/${exif.aperture}` : "--"}
								</span>
							</div>
							<div className="camera-info">
								<span className="info--title">Shutter Speed</span>
								<span className="info--value">
									{exif !== undefined ? `${exif.exposure_time}s` : "--"}
								</span>
							</div>
							<div className="camera-info">
								<span className="info--title">ISO</span>
								<span className="info--value">
									{exif !== undefined ? exif.iso : "--"}
								</span>
							</div>
							<div className="camera-info">
								<span className="info--title">Dimensions</span>
								<span className="info--value">
									{`${width} × ${height}` || "--"}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

function numberFormatter(num, digits) {
	let si = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "k" },
		{ value: 1e6, symbol: "M" },
		{ value: 1e9, symbol: "G" },
		{ value: 1e12, symbol: "T" },
		{ value: 1e15, symbol: "P" },
		{ value: 1e18, symbol: "E" },
	];
	let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	let i;
	for (i = si.length - 1; i > 0; i--) {
		if (num >= si[i].value) {
			break;
		}
	}
	return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function beautifyNumber(num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function returnTotal(arrOfValues) {
	return arrOfValues.reduce((a, c) => (a += c));
}

export default Modal;
