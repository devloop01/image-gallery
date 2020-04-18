import React, { useEffect, useState, Fragment, useRef } from "react";
import ImageCardList from "./components/ImageCardList";
import Header from "./components/Header";
import Modal from "./components/Modal";
import axios from "axios";
import imagesLoaded from "imagesloaded";
import "./styles/App.css";

console.clear();

const API = process.env.REACT_APP_API_URL;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const DEFAULT_IMAGE_COUNT = 25;
const IMAGE_INCREMENT_COUNT = 10;

function App() {
	const [images, setImages] = useState([]);
	const [query, setQuery] = useState("");
	const [prevQuery, setPrevQuery] = useState("");
	const [clickedImage, setClickedImage] = useState({});
	const [isModalActive, setModalActive] = useState(false);
	const [failedToLoad, setFailedToLoad] = useState(false);
	const [perPageCount, setPerPageCount] = useState(DEFAULT_IMAGE_COUNT);
	const [totalResults, setTotalResults] = useState(0);
	const [state, setState] = useState("loading");
	const [queryChanged, setqueryChanged] = useState(false);
	const [page, setPage] = useState("home");

	const loadButtonEl = useRef();

	const getRandomPhotos = () => {
		setState("loading");
		axios(`${API}/photos/random`, {
			params: {
				count: DEFAULT_IMAGE_COUNT,
				client_id: CLIENT_ID,
			},
		})
			.then((res) => {
				setImages(res.data);
				if (failedToLoad) setFailedToLoad(false);
			})
			.catch(() => setFailedToLoad(true));
	};

	useEffect(getRandomPhotos, [failedToLoad]);

	useEffect(waitForImages, [images]);

	const searchQuery = () => {
		if (query !== "") {
			setState("loading");
			setPage("search");
			axios(`${API}/search/photos/`, {
				params: {
					query: query,
					per_page: perPageCount,
					client_id: CLIENT_ID,
				},
			})
				.then((res) => {
					setImages(res.data.results);
					setTotalResults(res.data.total);
					if (failedToLoad) setFailedToLoad(false);
				})
				.catch(() => setFailedToLoad(true));
		}
	};

	useEffect(searchQuery, [perPageCount]);

	useEffect(() => {
		if (page === "home") {
			setQuery("");
			setPrevQuery("");
		}
	}, [page]);

	useEffect(() => {
		let loaded = 0;
		let cards = document.getElementsByClassName("image-card");
		for (let i = 0; i < cards.length; i++) {
			// eslint-disable-next-line no-loop-func
			imagesLoaded(cards[i], (instance) => {
				if (instance.isComplete) loaded++;
				if (loaded === perPageCount) setState("loaded");
			});
		}
	}, [images, perPageCount]);

	const handleSearch = () => {
		if (query !== prevQuery && query !== "") {
			setPerPageCount(DEFAULT_IMAGE_COUNT);
			setPrevQuery(query);
			searchQuery();
		}
	};

	const handleImageClick = (img) => {
		setClickedImage(img);
		setModalActive(true);
	};

	return (
		<Fragment>
			<Header
				onQueryChange={(q) => {
					setQuery(q);
					setqueryChanged(true);
				}}
				onQuerySearch={handleSearch}
				onGenarateRandomImages={() => getRandomPhotos()}
				onPageChange={(p) => setPage(p)}
			/>

			{prevQuery !== "" && page !== "home" && (
				<span className="text-info">
					<span>
						search results for <strong>"{prevQuery}"</strong>
					</span>
					<span className="total-results">
						found <strong>{totalResults}</strong> matching results
					</span>
				</span>
			)}

			{query === "" && queryChanged && !failedToLoad && (
				<h3 className="text-info type-something-info">Type something!</h3>
			)}

			{prevQuery !== "" && totalResults === 0 && (
				<div className="no-image-found-info">
					<h3>No Images Found</h3>
					<span>
						Try searching <strong>dogs</strong> or <strong>cats</strong>
					</span>
				</div>
			)}

			{(!failedToLoad && (
				<main>
					<ImageCardList
						images={images}
						onImageClicked={(img) => handleImageClick(img)}
					/>
					<h3
						className="text-info loading-text"
						style={{
							display: state === "loading" && !queryChanged ? "block" : "none",
						}}
					>
						Loading...
					</h3>
					<button
						className={`btn load-more ${state === "loading" ? "loading" : ""}`}
						ref={loadButtonEl}
						onClick={() => {
							setPerPageCount(perPageCount + IMAGE_INCREMENT_COUNT);
							setState("loading");
						}}
						style={{
							display:
								perPageCount >= totalResults || page === "home" ? "none" : "block",
							pointerEvents: state === "loading" ? "none" : "all",
						}}
					>
						{(state !== "loading" && "load more") || (
							<div id="wave">
								<span className="dot"></span>
								<span className="dot"></span>
								<span className="dot"></span>
							</div>
						)}
					</button>
				</main>
			)) ||
				(failedToLoad && (
					<div className="failed-info-container">
						<h1 className="failed-text">Failed To Load</h1>
						<p>check your connection</p>
					</div>
				))}

			{isModalActive && (
				<Modal
					imageData={clickedImage}
					onModalActive={(isActive) => setModalActive(isActive)}
				/>
			)}
		</Fragment>
	);
}

function resizeMasonryItem(item) {
	let grid = document.getElementsByClassName("masonry")[0],
		rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-row-gap")),
		rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"));
	let rowSpan = Math.ceil(
		(item.querySelector(".masonry-content").getBoundingClientRect().height + rowGap) /
			(rowHeight + rowGap)
	);
	item.style.gridRowEnd = "span " + rowSpan;
}

function resizeAllMasonryItems() {
	let allItems = document.getElementsByClassName("masonry-brick");
	for (let i = 0; i < allItems.length; i++) {
		resizeMasonryItem(allItems[i]);
	}
}

function waitForImages() {
	let allItems = document.getElementsByClassName("masonry-brick");
	for (let i = 0; i < allItems.length; i++) {
		imagesLoaded(allItems[i], (instance) => {
			const item = instance.elements[0];
			const cardForegroundEl = instance.images[0].img.parentElement.parentElement.querySelector(
				".image-card-fg"
			);
			item.style.display = "block";
			let t = setTimeout(() => {
				cardForegroundEl.classList.add("hide");
				clearTimeout(t);
			}, 200 + +cardForegroundEl.parentElement.getAttribute("data-card-index") * 120);
			resizeMasonryItem(item);
		});
	}
}

const events = ["load", "resize"];
events.forEach((event) => {
	window.addEventListener(event, resizeAllMasonryItems);
});

export default App;
