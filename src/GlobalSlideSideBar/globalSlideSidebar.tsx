import React, { useEffect, useRef, useState } from 'react';
// import '../../components/GlobalSlideSideBar/globalSlideSidebar.scss';
import './globalSlideSidebar.scss';
import '../Styles/ApplicationModal.scss';
import { Button } from 'primereact/button';
import kyamain from "../assets/kyamain.svg";
import kyaside from "../assets/kyaside.svg";
import kyahistory from "../assets/kyahistory.svg";
// import axios from "axios";
// import axiosWithADAuth from "../../services/axios";
// import { auth } from '../../credentials/Credentials';

interface SidebarProps {
    isOpened: boolean;
    appId?: number; // Be more specific if possible, e.g., `ApplicationId`
    userEmail?: string; // Optional prop for user email
    hideSideBar: () => void;
    handleNewRequest: () => void;
    historySession: any[];  // Be more specific if possible, e.g., `HistoryItem[]`
    historyActive: any | null;
    onClickHistory: (item: any, index: number) => void;
    handleMyPromtClick?: () => void; // Function to handle My Prompt click
    sidebarTitle?: string; //optional prop for the title
    deleteHistoryItem?: (item: any, index: number) => void;
    swaggerUrl?: string;
}

const SlideSidebar: React.FC<SidebarProps> = ({
    appId,
    // userEmail,
    isOpened,
    hideSideBar,
    handleNewRequest,
    historySession,
    historyActive,
    onClickHistory,
    sidebarTitle,
    deleteHistoryItem,
    handleMyPromtClick,
    swaggerUrl
}) => {

    const [sidebarHistoryActive, setSidebarHistoryActive] = useState<any | null>(historyActive);
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {

        const handleClickOutside = (event: any) => {
            if (window.innerWidth <= 768 && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                // Only close on mobile and if click is outside the sidebar
                hideSideBar();
            }
        };

        if (isOpened) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside); // Clean up when sidebar is closed
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Clean up on unmount
        };
    }, [isOpened, hideSideBar]); // Re-run effect when isOpenedRagSidebar changes

    // Create a new axios instance with basic auth for Teams environments
    // const createAxiosWithBasicAuth = () => {
    //     // Use the auth credentials from Credentials.ts
    //     return axios.create({
    //         baseURL: auth.proxy,
    //         auth: {
    //             username: auth.username,
    //             password: auth.password
    //         }
    //     });
    // };
    // const getAxiosInstance = () => {
    //     // Always use basic auth for Teams environments
    //     if (isAnyTeamsEnvironment) {
    //         console.log("Using basic auth for Teams environment");
    //         return createAxiosWithBasicAuth();
    //     } else {
    //         // Use AD auth for non-Teams environments
    //         console.log("Using basic auth for non-Teams environment");
    //         return axiosWithADAuth;
    //     }
    // };

    const handleOnClickHistory = (item: any, index: number) => {
        setSidebarHistoryActive(index);
        onClickHistory(item, index);
        if (window.innerWidth <= 768) { // Move the check here
            hideSideBar();
        }
    };
    const handleNewRequestSlide = () => {
        setSidebarHistoryActive(null);
        handleNewRequest();
        if (window.innerWidth <= 768) { // Move the check here
            hideSideBar();
        }
    }

    return (
        <nav className={`sdlc-rag-sidebar-history-container own-rag ${isOpened ? 'slidIn' : ''}`} ref={sidebarRef}>
            <div className="sidebar-controls">
                <span className="title" style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '80%' }}>
                    {appId === 57 ? (
                        <img width='20px' height='20px' src={("../../assets/list-icon/synaptgptlogo.svg")} alt="" />) : (
                        <img className='' src={kyamain} alt="KYA Main" />
                    )}

                    <h3 title={sidebarTitle} style={{
                        cursor: 'pointer',
                        margin: '0px', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '80%',
                        overflow: 'hidden'
                    }}>{sidebarTitle}</h3>
                </span>
                <img className={` ${isOpened && 'global-slide-toggle-globalicon'}`} title="Toggle Sidebar" style={{ cursor: 'pointer' }} onClick={hideSideBar} src={kyaside} alt="KYA Side" />
            </div>
            {appId === 159 ? (
                <button className="new-request" onClick={handleNewRequestSlide}>Create New Prompt</button>) : (
                <button className="new-request" onClick={handleNewRequestSlide}>New Request</button>
            )}
            <div style={{borderBottom: '1px solid #ccc', marginBottom: '10px', marginTop: '10px'}}></div>
            {appId === 159 ? (<div className="sidebar-header-history-kya"
                onClick={handleMyPromtClick}
            >
                <i className='pi pi-server my-prompt-lib-icon' style={{ fontSize: '1.2rem', color: '#3ea7af' }}></i>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between', width: '100%' }}>My Prompts <i className='pi pi-arrow-circle-right'></i></span>
            </div>) : (
                <div className="sidebar-header-history-kya" >
                    <img src={kyahistory} alt="KYA History" />
                    <span className='your-request-heading-synapt-side' style={{ fontSize: '14px' }}>Your Requests</span>
                </div>)}
            {appId !== 159 && (
                <ul className="sidebar-history" style={{ marginTop: 0 }}>
                    {historySession?.map((item: any, index: number) => { // Add key prop
                        if (index < 10) {
                            return (
                                <li
                                    key={index} // Use the index as a key (if no other unique identifier exists)
                                    title={item?.message}
                                    className={sidebarHistoryActive === index ? "active" : ""}
                                    onClick={() => handleOnClickHistory(item, index)}
                                >
                                    <div className='history-global-msg-container'>
                                        <span style={{ color: "red" }}>
                                            {item.is_static === true ? "**" : ""}
                                        </span>
                                        {appId === 16 ? <>{item?.application_name?.slice(0, 23)} - <span className="greyText">{item?.created_on}</span></> : `${item?.message?.slice(0, 23)}...`}
                                    </div>

                                    {appId === 57 && deleteHistoryItem && <div onClick={() => deleteHistoryItem(item, index)} className="delete-container-global-history"><i className={'pi pi-trash p-1'} title="Delete" style={{ fontSize: "0.85rem", color: "#3ea7af" }}></i></div>}
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>)}
            <div style={{ position: 'absolute', bottom: '10px', left: '-5px', width: '-webkit-fill-available', height: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {(swaggerUrl && appId !== 57) &&
                    <Button raised
                        label={"Swagger"}
                        className="swagger-button"
                        onClick={swaggerUrl ? () => window.open(swaggerUrl, '_blank') : undefined}
                        disabled={!swaggerUrl}
                    ></Button>
                }
            </div>
        </nav>
    );
};

export default SlideSidebar;