import React from "react";
import "./style.css";

export const Main = () => {
    return (
        <div className="main">
            <div className="div">
                <header className="header">
                    <div className="text-wrapper">Fuzzy Spork</div>
                    <div className="overlap-group">
                        <img className="profile-pic" alt="Profile pic" src="profile-pic.svg" />
                        <div className="header-options">
                            <div className="text-wrapper-2">Home</div>
                            <div className="text-wrapper-3">Contact us</div>
                            <div className="text-wrapper-4">About us</div>
                        </div>D:
                    </div>
                </header>
                <div className="main-contents">
                    <div className="text-wrapper-5">Look at the Camera!</div>
                    <div className="camera-view-area">
                        <div className="rectangle" />
                    </div>
                    <div className="updates">
                        <div className="overlap">
                            <div className="text-wrapper-6">Attendance Done</div>
                            <div className="succes-mark">
                                <img className="done" alt="Done" src="done.svg" />
                            </div>
                            <div className="details">
                                <div className="overlap-group-2">
                                    <div className="name-adwaith-PJ">Name&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;Adwaith PJ</div>
                                    <div className="roll-no">Roll no&nbsp;&nbsp; :&nbsp;&nbsp;2129013</div>
                                    <div className="section-CSCE">Section :&nbsp;&nbsp;CSCE-2</div>
                                    <div className="branch-CSCE">Branch&nbsp;&nbsp;:&nbsp;&nbsp;CSCE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="footer">
                    <div className="text-wrapper-7">fuzzy spork © 2023</div>
                </footer>
            </div>
        </div>
    );
};
