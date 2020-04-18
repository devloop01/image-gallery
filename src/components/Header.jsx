import React, { useRef, useState } from "react";

const Header = ({ onQueryChange, onQuerySearch, onGenarateRandomImages, onPageChange }) => {
	const [isFloatingInputActive, setFloatingInputActive] = useState(false);

	const inputEl = useRef();
	const floatingInputEl = useRef();

	const handleSubmit = (e) => {
		e.preventDefault();
		// onQuerySearch();
	};

	const handleHomePage = () => {
		onPageChange("home");
		onGenarateRandomImages();
		inputEl.current.value = "";
		floatingInputEl.current.value = "";
	};

	return (
		<header>
			<button className="btn home" onClick={handleHomePage}>
				<div className="icon gallery">
					<svg viewBox="0 0 388.309 388.309" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M201.173,307.042c-11.291-0.174-22.177-4.233-30.825-11.494l-56.947-50.155c-8.961-8.373-22.664-9.036-32.392-1.567
				L0.03,303.384v38.661c-0.582,10.371,7.355,19.25,17.726,19.832c0.534,0.03,1.07,0.037,1.605,0.021h286.824
				c11.494,0,22.988-8.359,22.988-19.853V240.691L226.25,300.25C218.684,304.798,210.001,307.15,201.173,307.042z"
						/>
						<circle cx="196.993" cy="182.699" r="22.988" />
						<path
							d="M383.508,67.238c-3.335-4.544-8.487-7.406-14.106-7.837L84.667,26.487c-5.551-0.465-11.091,1.012-15.673,4.18
				c-4.058,3.524-6.817,8.307-7.837,13.584l-4.702,40.751h249.731c23.809,0.54,43.061,19.562,43.886,43.363v184.424
				c0-1.045,4.702-2.09,6.792-4.18c4.326-3.397,6.834-8.606,6.792-14.106L388.21,82.389
				C388.753,76.91,387.057,71.445,383.508,67.238z"
						/>
						<path
							d="M306.185,105.899H19.361c-11.494,0-19.331,10.971-19.331,22.465v148.898l68.963-50.155
				c17.506-12.986,41.724-11.895,57.992,2.612l57.469,50.155c8.666,7.357,21.044,8.406,30.824,2.612l113.894-66.351v-87.771
				C328.382,116.099,318.465,106.408,306.185,105.899z M196.993,226.584c-24.237,0-43.886-19.648-43.886-43.886
				c0-24.237,19.648-43.886,43.886-43.886c24.237,0,43.886,19.648,43.886,43.886C240.879,206.936,221.231,226.584,196.993,226.584z"
						/>
					</svg>
				</div>
				<span className="title">Gallery</span>
			</button>

			<form onSubmit={handleSubmit}>
				<div className="form-group g-1">
					<input
						type="text"
						placeholder="Type here"
						onChange={() => onQueryChange(inputEl.current.value)}
						ref={inputEl}
					/>
					<button
						className="btn search"
						onClick={onQuerySearch}
						disabled={
							inputEl.current !== undefined && inputEl.current.value.length === 0
								? true
								: false
						}
					>
						<div className="icon search">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
								<path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
							</svg>
						</div>
						<span>search</span>
					</button>
				</div>
				<div className="form-group g-2">
					<button className="btn search" onClick={() => setFloatingInputActive(true)}>
						<div className="icon search">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
								<path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
							</svg>
						</div>
					</button>
				</div>

				<div className={`floating--container ${isFloatingInputActive ? "" : "hide"}`}>
					<div className="input--container">
						<input
							type="text"
							placeholder="Type here"
							onChange={() => onQueryChange(floatingInputEl.current.value)}
							ref={floatingInputEl}
						/>
						<button
							className="btn search"
							onClick={onQuerySearch}
							disabled={
								floatingInputEl.current !== undefined &&
								floatingInputEl.current.value.length === 0
									? true
									: false
							}
						>
							search
						</button>
					</div>

					<button className="btn close" onClick={() => setFloatingInputActive(false)}>
						<div className="icon cross">
							<svg
								viewBox="0 0 512 512"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="false"
							>
								<path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" />
							</svg>
						</div>
					</button>
				</div>
			</form>
		</header>
	);
};

export default Header;
