// import React from "react";
import { useState, useRef, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
// import axios from "../services/axios";
import SlideSidebar from "./GlobalSlideSideBar/globalSlideSidebar";
import './Styles/ticketClassifierStyles.scss';
import { FileUploadDropzone } from "./FileUploadDropzone";
import kyamain from "./assets/kyamain.svg";
import kyaside from "./assets/kyaside.svg";
import './Styles/theme.scss';
import LoadingComponent from "./LoadingComponent";
import './Styles/loaderStyles.scss';
import { Toast } from "primereact/toast";
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TicketTable from "./TicketTable";

interface Department {
    name: string;
    code: string;
}

// Individual interfaces for better type safety
interface CategoryData {
    [key: number]: string; // e.g., { 0: 'User Account', 1: 'Password Reset', ... }
}

interface DescriptionData {
    [key: number]: string; // e.g., { 0: 'emp c...', ... }
}
interface ProcessedDescriptionData {
    [key: number]: string; // e.g., { 0: 'emp c...', ... }
}

interface SubCategoryData {
    [key: number]: string; // e.g., { 0: 'Password Reset', ... }
}

interface TicketIdData {
    [key: number]: string; // e.g., { 0: '35019103', ... }
}

interface ConcatenatedCategoryData {
    [key: number]: string; // e.g., { 0: 'User...', ... }
}
interface InterData3 {
    [key: string]: number
}
interface InterData2 {
    class_probabilities: InterData3;
    predicted_class: string;
    ticket_status: string;
}
interface IntermediateResultData {
    [key: number]: InterData2; // e.g., { 0: {...}, 1: {...}, ... }
}

interface ProcessedConcatenatedCategoryData {
    [key: number]: string;
}

// Main interface for tabular_data
interface TabularData {
    Category: CategoryData;
    Description: DescriptionData;
    Processed_Description: ProcessedDescriptionData;
    Sub_Category: SubCategoryData;
    Ticket_ID: TicketIdData;
    concatenated_category: ConcatenatedCategoryData;
    intermediate_result: IntermediateResultData;
    processed_concatenated_category: ProcessedConcatenatedCategoryData;
}

// Interface for the transformed row data
interface TableRowData {
    id: string;
    ticketId: string;
    category: string;
    subCategory: string;
    description: string;
    processedDescription: string;
    concatenatedCategory: string;
    processedConcatenatedCategory: string;
    intermediateResult: any;
}

export default function TicketClassifier(props: any) {
    const userName: string | null = sessionStorage.getItem("displayName")?.toString() ?? "Raj Kapoor";
    const [showWelcomeMessage, setShowWelcomeMessage] = useState<boolean>(true);
    const applicationType = props?.props?.title;
    // const applicationObjId = props?.props?.objid;
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading,] = useState<boolean>(false);
    const [history,] = useState<any | null>([]);
    const [historyIndex, setHistoryIndex] = useState<any | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [trainingFiles, setTrainingFiles] = useState<File[]>([]);
    const [testingFiles, setTestingFiles] = useState<File[]>([]);
    const [tabularData, setTabularData] = useState<TabularData | null>(null);
    const [tableData, setTableData] = useState<TableRowData[]>([]);
    const [tableShow, setTableShow] = useState<boolean>(false);

    const [valCategory, setValCategory] = useState<CategoryData[]>([]);

    // Define columns for the DataTable
    const columns = [
        { field: 'ticketId', header: 'Ticket ID' },
        { field: 'category', header: 'Category' },
        { field: 'subCategory', header: 'Sub Category' },
        { field: 'description', header: 'Description' },
        { field: 'processedDescription', header: 'Processed Description' },
        { field: 'concatenatedCategory', header: 'Concatenated Category' },
        { field: 'processedConcatenatedCategory', header: 'Processed Concatenated Category' }
    ];

    const transformTabularDataToRows = (data?: TabularData): TableRowData[] => {
        if (!data) return [];
        const rows: TableRowData[] = [];

        // Get the keys from one of the objects (assuming all have same indices)
        const indices = Object.keys(data.Category);

        indices.forEach(index => {
            const numIndex = parseInt(index);
            rows.push({
                id: index, // Use index as ID
                ticketId: data.Ticket_ID[numIndex] || '',
                category: data.Category[numIndex] || '',
                subCategory: data.Sub_Category[numIndex] || '',
                description: data.Description[numIndex] || '',
                processedDescription: data.Processed_Description[numIndex] || '',
                concatenatedCategory: data.concatenated_category[numIndex] || '',
                processedConcatenatedCategory: data.processed_concatenated_category[numIndex] || '',
                intermediateResult: data.intermediate_result[numIndex] || {}
            });
        });

        return rows;
    };

    // Custom body template for long text fields (optional)
    // const descriptionBodyTemplate = (rowData: TableRowData) => {
    //     return (
    //         <div title={rowData.description}>
    //             {rowData.description.length > 50
    //                 ? `${rowData.description.substring(0, 50)}...`
    //                 : rowData.description}
    //         </div>
    //     );
    // };

    // const processedDescriptionBodyTemplate = (rowData: TableRowData) => {
    //     return (
    //         <div title={rowData.processedDescription}>
    //             {rowData.processedDescription.length > 50
    //                 ? `${rowData.processedDescription.substring(0, 50)}...`
    //                 : rowData.processedDescription}
    //         </div>
    //     );
    // };

    const toastRef = useRef<Toast>(null);
    const failureToast = (message: string) => {
        toastRef.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 5000 });
    }
    const successToast = (message: string) => {
        toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 5000 });
    }

    const dropdownRef = useRef<HTMLDivElement>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    const departments: Department[] = [
        { name: 'Admin', code: 'ADM' },
        { name: 'IT', code: 'IT' },
        { name: 'Finance', code: 'FIN' },
        { name: 'Tools', code: 'TLS' },
        { name: 'HR', code: 'HR' },
        { name: 'Travel', code: 'TRV' },
        { name: 'RMG', code: 'RMG' }
    ];
    const [selectedFeatures] = useState([
        'Ticket ID',
        'Description',
        'Category',
        'Sub Category'
    ]);

    const scrollableContentRef = useRef<HTMLDivElement>(null);
    const hideSideBar = (): void => {
        setIsVisible(!isVisible);
    };

    const handleNewChat = () => {
        setHistoryIndex(null);
        setCollapsed(true);
        setFileProcessed(false);
        setSelectedCategory('');
        setShowWelcomeMessage(true);
        setTestingFiles([]);
        setTrainingFiles([]);
        setLoadMetrics(false);
        setLoadPrecision(false);
        setSelectedModels([]);
        setSelectedDepartment(null);
        setTableShow(false)
        // Handle new chat request
    };
    const onClickHistory = (item: any, index: number) => {
        console.log("Clicked history item:", item, index);
        setHistoryIndex(index);
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const formData = new FormData();
    //             formData.append("app_id", `${applicationObjId}`);

    //             await axios
    //                 .post("/synaptframework/get/sessions", formData, {

    //                 })
    //                 .then((response) => {

    //                     const parsedHistory = response?.data?.map((item: any) => {
    //                         try {
    //                             return { message: item.name, id: item.objid, is_static: item.is_static };
    //                         } catch (error) {
    //                             // if (error) {
    //                             //     const errMsg = error?.response?.data?.detail;
    //                             //     // setApi_error(true);
    //                             //     // setErrorMsg(errMsg);
    //                             // }

    //                             return { message: item.name, id: item.objid, is_static: item.is_static };
    //                         }
    //                     });

    //                     setHistory(parsedHistory);
    //                 });
    //         } catch (error) { }
    //     };
    //     fetchData();
    // }, []);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropDownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (department: Department) => {
        setSelectedDepartment(department);
        setIsDropDownOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedDepartment(null);
    };

    const toggleDropdown = () => {
        setIsDropDownOpen(!isDropDownOpen);
    };
    const [fileProcessed, setFileProcessed] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // State to store selected models
    const [selectedModels, setSelectedModels] = useState<string[]>([]);

    // Handle checkbox change
    const handleCheckboxChange = (event: any) => {
        const { value, checked } = event.target;

        if (checked) {
            // Add model to selected models if checked
            setSelectedModels(prev => [...prev, value]);
        } else {
            // Remove model from selected models if unchecked
            setSelectedModels(prev => prev.filter(model => model !== value));
        }
    };
    const [loadMetrics, setLoadMetrics] = useState(false);
    const [loadPrecision, setLoadPrecision] = useState(false);
    const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
    const [isPredicting, setIsPredicting] = useState<boolean>(false);
    // const [prediction, setPrediction] = useState<string>("");

    const handleTrainingFile = () => {
        // Show file processing loading
        setIsProcessingFile(true);
        setFileProcessed(true);

        // Set loadMetrics to true after 4 seconds and hide loading
        setTimeout(() => {
            setLoadMetrics(true);
            setShowWelcomeMessage(false);
            setIsProcessingFile(false);
        }, 4000);
    };
    const handleShowPrecisions = () => {
        // Show file processing loading
        setIsProcessingFile(true);

        // Set loadPrecision to true after 4 seconds and hide loading
        setTimeout(() => {
            setLoadPrecision(true);
            setIsProcessingFile(false);
        }, 4000);
    };
    const handlePredictionNew = () => {
        setIsPredicting(true);
        setTimeout(() => {
            successToast(`Prediction completed successfully`);
            setShowWelcomeMessage(false);
            // Hard coded table Here....
            setTableShow(true);
            setIsPredicting(false);
        }, 4000);
    };

    // const handlePrediction = async () => {
    //     // Show file processing loading
    //     setIsPredicting(true);

    //     try {
    //         // Check if file is selected
    //         if (!testingFiles || testingFiles.length === 0) {
    //             alert('Please select a file first');
    //             setIsPredicting(false);
    //             return;
    //         }

    //         // Create FormData to send the file
    //         const formData = new FormData();
    //         formData.append('file', testingFiles[0]);

    //         // Make API call with axios
    //         const response = await axios.post('http://10.169.21.107:8001/batch-prediction', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             }
    //         });

    //         // Axios automatically parses JSON response and stores it in response.data
    //         const data = response.data;

    //         if (data.status === 'success') {
    //             // Handle successful response
    //             successToast(`Prediction completed successfully: ${data.message}`);
    //             let result = data.results;
    //             // You can now use the returned data
    //             // const { tabular_data, for_pie_chart, test_result_dict: TestResult } = data.results;
    //             setTabularData(result.tabular_data);
    //             setValCategory(result.tabular_data.Category);
    //             const transformedData = transformTabularDataToRows(tabularData ?? undefined);
    //             setTableData(transformedData);

    //             setShowWelcomeMessage(false);
    //             // Hard coded table Here....
    //             setTableShow(true);
    //         } else {
    //             failureToast(`Prediction failed: ${data.message}`);
    //             throw new Error('Prediction failed');
    //         }

    //     } catch (error) {
    //         console.error('Error during prediction:', error);
    //         // Use type assertion to check for AxiosError
    //         if (axios.isAxiosError(error)) {
    //             if (error.response) {
    //                 // Server responded with error status
    //                 failureToast(`Server Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    //             } else if (error.request) {
    //                 // Request was made but no response received
    //                 failureToast('Network Error: No response from server');
    //             } else {
    //                 // Something else happened
    //                 failureToast(`Error: ${error.message}`);
    //             }
    //         } else if (error instanceof Error) {
    //             // Non-Axios error
    //             failureToast(`Error: ${error.message}`);
    //         }
    //     } finally {
    //         // Hide loading state
    //         setIsPredicting(false);
    //     }
    // };


    //     const handlePrediction = async () => {
    //     setIsPredicting(true);

    //     try {
    //         if (!testingFiles || testingFiles.length === 0) {
    //             alert('Please select a file first');
    //             setIsPredicting(false);
    //             return;
    //         }

    //         const formData = new FormData();
    //         formData.append('file', testingFiles[0]);

    //         const response = await axios.post('http://10.169.21.107:8001/batch-prediction', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             }
    //         });

    //         // DEBUG: Log the entire response structure
    //         console.log('=== FULL API RESPONSE ===');
    //         console.log(JSON.stringify(response.data, null, 2));

    //         const data = response.data;

    //         if (data.status === 'success') {
    //             successToast(`Prediction completed successfully: ${data.message}`);

    //             // Try different possible structures
    //             console.log('=== CHECKING DIFFERENT STRUCTURES ===');

    //             // Option 1: Direct results
    //             console.log('Option 1 - data.results:', data.results);

    //             // Option 2: Nested in data
    //             console.log('Option 2 - data.data:', data.data);

    //             // Option 3: Direct properties
    //             console.log('Option 3 - data.tabular_data:', data.tabular_data);
    //             console.log('Option 3 - data.for_pie_chart:', data.for_pie_chart);
    //             console.log('Option 3 - data.test_result_dict:', data.test_result_dict);

    //             // Try to extract tabular_data from different possible locations
    //             let tabular_data = null;
    //             let for_pie_chart = null;
    //             let test_result_dict = null;

    //             if (data.results) {
    //                 // Original expected structure
    //                 tabular_data = data.results.tabular_data;
    //                 for_pie_chart = data.results.for_pie_chart;
    //                 test_result_dict = data.results.test_result_dict;
    //             } else if (data.data) {
    //                 // Alternative structure
    //                 tabular_data = data.data.tabular_data;
    //                 for_pie_chart = data.data.for_pie_chart;
    //                 test_result_dict = data.data.test_result_dict;
    //             } else {
    //                 // Direct properties
    //                 tabular_data = data.tabular_data;
    //                 for_pie_chart = data.for_pie_chart;
    //                 test_result_dict = data.test_result_dict;
    //             }

    //             console.log('=== EXTRACTED DATA ===');
    //             console.log('tabular_data:', tabular_data);
    //             console.log('for_pie_chart:', for_pie_chart);
    //             console.log('test_result_dict:', test_result_dict);

    //             // Check if tabular_data exists and process it
    //             if (tabular_data) {
    //                 console.log('=== TABULAR DATA DETAILS ===');
    //                 console.log('Type:', typeof tabular_data);
    //                 console.log('Keys:', Object.keys(tabular_data));

    //                 // Check if it's an array or object
    //                 if (Array.isArray(tabular_data)) {
    //                     console.log('tabular_data is an array with length:', tabular_data.length);
    //                     console.log('First few items:', tabular_data.slice(0, 3));
    //                 } else if (typeof tabular_data === 'object') {
    //                     console.log('tabular_data is an object');
    //                     // Check each property
    //                     Object.keys(tabular_data).forEach(key => {
    //                         console.log(`${key}:`, tabular_data[key]);
    //                     });
    //                 }

    //                 // Try to set the data regardless of structure
    //                 setTabularData(tabular_data);

    //                 // Only transform if it matches expected structure
    //                 if (tabular_data.Category && typeof tabular_data.Category === 'object') {
    //                     const transformedData = transformTabularDataToRows(tabular_data);
    //                     console.log('Transformed data:', transformedData);
    //                     setTableData(transformedData);
    //                 } else {
    //                     console.log('tabular_data does not match expected structure');
    //                     // Handle different structure - maybe it's already in array format?
    //                     if (Array.isArray(tabular_data)) {
    //                         setTableData(tabular_data);
    //                     }
    //                 }
    //             } else {
    //                 console.error('tabular_data not found in any expected location');
    //                 failureToast('No tabular data received from API');
    //             }

    //         } else {
    //             failureToast(`Prediction failed: ${data.message || 'Unknown error'}`);
    //         }

    //     } catch (error) {
    //         console.error('Error during prediction:', error);

    //         // if (error.response) {
    //         //     console.log('Error response data:', error.response.data);
    //         //     console.log('Error response status:', error.response.status);
    //         //     failureToast(`Server Error: ${error.response.status}`);
    //         // } else if (error.request) {
    //         //     failureToast('Network Error: No response from server');
    //         // } else {
    //         //     failureToast(`Error: ${error.message}`);
    //         // }
    //     } finally {
    //         setIsPredicting(false);
    //     }
    // };
    return (
        <div>
            <Sidebar
                className="detail-page synapt-dev-sidebar"
                visible={true}
                onHide={() => props.onClose()}
                fullScreen
                showCloseIcon={false}
            >
                <LoadingComponent isLoading={isLoading || isProcessingFile || isPredicting} />
                <Toast ref={toastRef} style={{ zIndex: 100000000000 }} />
                <div className="modalContainer">
                    <SlideSidebar
                        isOpened={isVisible}
                        hideSideBar={hideSideBar}
                        handleNewRequest={handleNewChat}
                        historySession={history}
                        historyActive={historyIndex}
                        onClickHistory={onClickHistory}
                        sidebarTitle={props?.props?.title}
                        swaggerUrl={props?.props?.swagger_url}
                    />
                    {/* Render your ticket classification UI here */}
                    <div className="custom-main-content shadow-1 surface-50">
                        <div>
                            {!isVisible && <div className="flex align-items-center gap-2" style={{ display: 'flex' }}>
                                <div className="sideBarIcon m-0">
                                    <img src={kyamain} alt="MOM_logo"
                                        style={{ width: '20px', height: '20px' }} />
                                </div>
                                <div className="sideBarTtext-container">
                                    <div className="sideBarTtext flex">
                                        <h2 className="mainHeader p-0" style={{ margin: 0 }}>
                                            {applicationType || ""}
                                        </h2>
                                    </div>
                                </div>
                                <img title="Toggle Sidebar" style={{ cursor: 'pointer', padding: '5px' }} src={kyaside} alt="KYA Side" onClick={hideSideBar} />
                            </div>
                            }
                            <i
                                className="pi pi-times closeIcon text-secondary"
                                onClick={() => props.onClose()}
                                aria-label="Close"
                            ></i>
                        </div>
                        <div
                            className="scrollableContent relative ticketClass"
                            style={{
                                height: collapsed ? "90%" : "60%", maxHeight: "90%", overflowY: "scroll",
                                overflowX: "hidden"
                            }}
                            ref={scrollableContentRef}
                        >
                            {(showWelcomeMessage) && (
                                <div className="welcome-message-ticketClass">
                                    <div>
                                        <img className='pl-3' src={kyamain} alt="KYA Main" />
                                    </div>
                                    <h4>Welcome {userName}</h4>
                                    <h1>{applicationType}</h1>
                                    <p>{props.props.description}</p>
                                </div>
                            )}
                            <div className="radio-container">
                                <div className="radio-wrapper">
                                    <div className="radio-item">
                                        <input
                                            type="radio"
                                            id="train-radio"
                                            name="train-test"
                                            value="training"
                                            onChange={(e) => { setSelectedCategory(e.target.value); }}
                                            checked={selectedCategory === 'training'}
                                            className="custom-radio"
                                        />
                                        <label htmlFor="train-radio" className="radio-label">
                                            Re-Train Model
                                        </label>
                                    </div>
                                    <div className="radio-item">
                                        <input
                                            type="radio"
                                            id="test-radio"
                                            name="train-test"
                                            value="testing"
                                            onChange={(e) => { setSelectedCategory(e.target.value); }}
                                            checked={selectedCategory === 'testing'}
                                            className="custom-radio"
                                        />
                                        <label htmlFor="test-radio" className="radio-label">
                                            Test Model
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {selectedCategory === 'training' && (
                                <div className="training-options">
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div className="dropdown-container">
                                            <label className="dropdown-label" htmlFor="department-dropdown">Select Department</label>
                                            <div className="dropdown-wrapper" ref={dropdownRef}>
                                                <div
                                                    className="dropdown-trigger"
                                                    onClick={toggleDropdown}
                                                >
                                                    <span className="dropdown-text">
                                                        {selectedDepartment ? selectedDepartment.name : "Select any one ..."}
                                                    </span>
                                                    <div className="dropdown-icons">
                                                        {selectedDepartment && (
                                                            <button
                                                                className="clear-btn"
                                                                onClick={handleClear}
                                                                type="button"
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                        <span className={`dropdown-arrow ${isDropDownOpen ? 'open' : ''}`}>▼</span>
                                                    </div>
                                                </div>

                                                {isDropDownOpen && (
                                                    <div className="dropdown-menu">
                                                        {departments.map((dept) => (
                                                            <div
                                                                key={dept.code}
                                                                className="dropdown-item"
                                                                onClick={() => handleSelect(dept)}
                                                            >
                                                                {dept.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Render training options here */}
                                        <FileUploadDropzone
                                            label="Upload Training File"
                                            subLabel="Only .csv & .xlsx files are allowed"
                                            acceptedFormats={['.csv', '.xlsx']}
                                            maxFiles={1}
                                            maxFileSize={10}
                                            files={trainingFiles}
                                            setFiles={setTrainingFiles}
                                        />
                                    </div>
                                    {(trainingFiles.length > 0 && loadMetrics) &&
                                        <div>
                                            <div className="feature-container">
                                                <h2>Features Selected for Training</h2>

                                                <div className="table-wrapper">
                                                    {/* <button className="scroll-btn left" onClick={scrollLeft}>‹</button> */}

                                                    <div className="features-table" ref={scrollRef}>
                                                        {selectedFeatures.map((feature, index) => (
                                                            <div key={index} className="feature-item">
                                                                {feature}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* <button className="scroll-btn right" onClick={scrollRight}>›</button> */}
                                                </div>
                                            </div>

                                            <div className="modelIdentified-container">
                                                <h2>Models Identified for classification</h2>

                                                <div className="checkbox-group">
                                                    <label className="checkbox-item">
                                                        <input
                                                            type="checkbox"
                                                            name="models"
                                                            value="logistic_regression"
                                                            className="checkbox-input"
                                                            checked={selectedModels.includes("logistic_regression")}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                        <span className="checkbox-label">Logistic Regression</span>
                                                    </label>

                                                    <label className="checkbox-item">
                                                        <input
                                                            type="checkbox"
                                                            name="models"
                                                            value="multinomial_naive_bayes"
                                                            className="checkbox-input"
                                                            checked={selectedModels.includes("multinomial_naive_bayes")}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                        <span className="checkbox-label">Multinomial Naive Bayes</span>
                                                    </label>

                                                    <label className="checkbox-item">
                                                        <input
                                                            type="checkbox"
                                                            name="models"
                                                            value="support_vector_classifier"
                                                            className="checkbox-input"
                                                            checked={selectedModels.includes("support_vector_classifier")}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                        <span className="checkbox-label">Support Vector Classifier</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {(trainingFiles.length > 0 && loadPrecision) && (
                                        <div className="precision-section">
                                            <div className="metrics-section">
                                                <h2>Precision Metrics</h2>
                                                <div className="metrics-container">
                                                    <div className="metric-item">
                                                        <span className="metric-label">Accuracy:</span>
                                                        <span className="metric-value">&nbsp;{(0.7059340659340659).toFixed(5)}</span>
                                                    </div>
                                                    <div className="metric-item">
                                                        <span className="metric-label">Precision:</span>
                                                        <span className="metric-value">&nbsp;{(0.7173969070144451).toFixed(5)}</span>
                                                    </div>
                                                    <div className="metric-item">
                                                        <span className="metric-label">Recall:</span>
                                                        <span className="metric-value">&nbsp;{(0.7059340659340659).toFixed(5)}</span>
                                                    </div>
                                                    <div className="metric-item">
                                                        <span className="metric-label">F1-score:</span>
                                                        <span className="metric-value">&nbsp;{(0.7092098624565653).toFixed(5)}</span>
                                                    </div>
                                                    <div className="metric-item">
                                                        <span className="metric-label">Mean Accuracy:</span>
                                                        <span className="metric-value">&nbsp;{(0.9154846794826793).toFixed(5)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="precision-chart-container">
                                                {/* Render charts for each selected model */}
                                                {selectedModels.map(model => (
                                                    <div key={model} className="model-chart">
                                                        <h4>{model.charAt(0).toUpperCase() + model.slice(1)} Model</h4>
                                                        <img
                                                            src={`src/assets/${model}-roc.png`}
                                                            alt={`${model} ROC Chart`}
                                                            width="100%"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {selectedCategory === 'testing' && (
                                <>
                                    <div className="testing-options">
                                        {/* Render testing options here */}
                                        <FileUploadDropzone
                                            label="Upload Testing File"
                                            subLabel="Only .csv & .xlsx files are allowed"
                                            acceptedFormats={['.csv', '.xlsx']}
                                            maxFiles={1}
                                            maxFileSize={10}
                                            files={testingFiles}
                                            setFiles={setTestingFiles}
                                        />
                                        {tableShow && (
                                            <TicketTable />
                                        )}
                                    </div>
                                    {tableData.length > 0 && (
                                        <DataTable value={tableData} tableStyle={{ minWidth: '80rem' }}>
                                            {columns.map((col) => (
                                                <Column
                                                    key={col.field}
                                                    field={col.field}
                                                    header={col.header}
                                                    style={{ minWidth: '150px' }}
                                                />
                                            ))}
                                        </DataTable>
                                    )}
                                    {valCategory.length > 0 && (
                                        <DataTable value={valCategory} tableStyle={{ minWidth: '50rem' }}>
                                            <Column
                                                field="0"
                                                header="Validation Category"
                                                style={{ minWidth: '150px' }}
                                            />
                                        </DataTable>
                                    )}

                                </>
                            )}

                        </div>
                        <div className="footer-section">
                            {selectedCategory === "training" &&
                                <>
                                    {(trainingFiles?.length > 0 && !fileProcessed && selectedDepartment) && (
                                        <button
                                            className="submit-btn"
                                            onClick={handleTrainingFile}
                                            disabled={isProcessingFile}
                                        >
                                            Upload File
                                        </button>
                                    )}
                                    {(isProcessingFile && !fileProcessed) && (
                                        <div className="processing-message">
                                            <p>Processing your training file, please wait...</p>
                                        </div>
                                    )}
                                    {(trainingFiles?.length > 0 && fileProcessed && selectedModels.length > 0 && !loadPrecision) && (
                                        <button
                                            className="submit-btn"
                                            onClick={handleShowPrecisions}
                                            disabled={isProcessingFile}
                                        >
                                            Submit
                                        </button>
                                    )}
                                </>
                            }
                            {selectedCategory === 'testing' && (
                                <>
                                    {(testingFiles.length > 0 && isPredicting) &&
                                        <div className="processing-message">
                                            Prediction in progress, please wait...
                                        </div>
                                    }
                                    {((testingFiles.length > 0) && !tableShow) &&
                                        <button
                                            className="submit-btn"
                                            onClick={handlePredictionNew}
                                            disabled={isPredicting}
                                        >
                                            Predict
                                        </button>
                                    }
                                    {(tableShow && !isPredicting && (testingFiles.length > 0)) && (
                                        <button
                                            className="submit-btn"
                                            // onClick={handleDownloadPrediction}
                                            disabled={isPredicting}
                                        >
                                            Download Prediction
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </Sidebar >
        </div >
    );
}
