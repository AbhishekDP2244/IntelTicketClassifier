import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./Styles/ticketTable.scss";

export default function TicketTable() {
    const tickets = [
        {
            Ticket_ID: "2501191314",
            Description: "Employment verification letter",
            category: "Bonafide",
            sub_category: "Bonafide - Self Service",
            first_key: "Bonafide > Bonafide - Self Service",
            first_value: 0.9751856045651712,
            second_key: "ERP updation > Official information change",
            second_value: 0.02296456733827591,
            third_key: "ERP updation > Personal Information change",
            third_value: 0.0014489986723004277,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191323",
            Description: "Need Udemy business license",
            category: "EdTech License Request",
            sub_category: "Udemy for Business License Request",
            first_key: "EdTech License Request > Udemy for Business License Request",
            first_value: 0.9710150556412728,
            second_key: "EdTech License Request > Linkedin Learning License Request",
            second_value: 0.009789348573535904,
            third_key: "Software Requests > License Software Installation",
            third_value: 0.008406033561684515,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191344",
            Description: "Hi Provide me a Udemy License",
            category: "EdTech License Request",
            sub_category: "Linkedin Learning License Request",
            first_key: "EdTech License Request > Linkedin Learning License Request",
            first_value: 0.49196355732610175,
            second_key: "EdTech License Request > Udemy for Business License Request",
            second_value: 0.36202860493254985,
            third_key: "Software Requests > License Software Installation",
            third_value: 0.08650076305760306,
            ticket_queue_status: "Ticket is still in Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191351",
            Description: "System access request for SAP",
            category: "Access Management",
            sub_category: "SAP Access Request",
            first_key: "Access Management > SAP Access Request",
            first_value: 0.945215482163112,
            second_key: "Access Management > Oracle Access Request",
            second_value: 0.033201554728113,
            third_key: "Access Management > Database Access Request",
            third_value: 0.021582963108775,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191360",
            Description: "Laptop screen flickering issue",
            category: "IT Support",
            sub_category: "Hardware",
            first_key: "IT Support > Hardware",
            first_value: 0.902113457881112,
            second_key: "IT Support > Software",
            second_value: 0.071152348910001,
            third_key: "IT Support > Connectivity",
            third_value: 0.026734193208887,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191375",
            Description: "VPN not connecting while remote",
            category: "Network",
            sub_category: "VPN Issue",
            first_key: "Network > VPN Issue",
            first_value: 0.889104332113,
            second_key: "Network > Connectivity",
            second_value: 0.081245788192,
            third_key: "IT Support > Login Issue",
            third_value: 0.029649879695,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191389",
            Description: "Request for Microsoft Visio license",
            category: "Software Requests",
            sub_category: "License Software Installation",
            first_key: "Software Requests > License Software Installation",
            first_value: 0.956314591231,
            second_key: "EdTech License Request > Udemy for Business License Request",
            second_value: 0.022145213781,
            third_key: "Software Requests > Application Installation",
            third_value: 0.021540195112,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191401",
            Description: "Password reset required for HR portal",
            category: "IT Support",
            sub_category: "Password Reset",
            first_key: "IT Support > Password Reset",
            first_value: 0.9614521182,
            second_key: "IT Support > Login Issue",
            second_value: 0.0301142195,
            third_key: "Access Management > HR Portal Access",
            third_value: 0.0084336623,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191417",
            Description: "Unable to access payroll reports",
            category: "ERP updation",
            sub_category: "Official Information Change",
            first_key: "ERP updation > Official information change",
            first_value: 0.882199451123,
            second_key: "ERP updation > Personal Information change",
            second_value: 0.07342114522,
            third_key: "ERP updation > Leave Management",
            third_value: 0.044379403657,
            ticket_queue_status: "Ticket is still in Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191430",
            Description: "Outlook not opening after update",
            category: "Software",
            sub_category: "Application Error",
            first_key: "Software > Application Error",
            first_value: 0.9241894456,
            second_key: "IT Support > Software",
            second_value: 0.051144231,
            third_key: "Email > Performance",
            third_value: 0.024666323,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191442",
            Description: "Employment proof for loan",
            category: "Bonafide",
            sub_category: "Bonafide - HR Approval",
            first_key: "Bonafide > Bonafide - HR Approval",
            first_value: 0.94218540123,
            second_key: "Bonafide > Bonafide - Self Service",
            second_value: 0.04115555623,
            third_key: "ERP updation > Official information change",
            third_value: 0.01665904254,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191455",
            Description: "LinkedIn Learning access request",
            category: "EdTech License Request",
            sub_category: "Linkedin Learning License Request",
            first_key: "EdTech License Request > Linkedin Learning License Request",
            first_value: 0.9641588452,
            second_key: "EdTech License Request > Udemy for Business License Request",
            second_value: 0.0212591993,
            third_key: "Software Requests > License Software Installation",
            third_value: 0.0145821511,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191470",
            Description: "Request for Tableau desktop license",
            category: "Software Requests",
            sub_category: "License Software Installation",
            first_key: "Software Requests > License Software Installation",
            first_value: 0.959852158,
            second_key: "Software Requests > Application Installation",
            second_value: 0.029141221,
            third_key: "EdTech License Request > Udemy for Business License Request",
            third_value: 0.011006621,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191483",
            Description: "Payroll discrepancy for last month",
            category: "ERP updation",
            sub_category: "Official Information Change",
            first_key: "ERP updation > Official information change",
            first_value: 0.8731594512,
            second_key: "ERP updation > Personal Information change",
            second_value: 0.0812214521,
            third_key: "ERP updation > Leave Management",
            third_value: 0.0456190967,
            ticket_queue_status: "Ticket is still in Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191496",
            Description: "Internet disconnecting intermittently",
            category: "Network",
            sub_category: "Connectivity",
            first_key: "Network > Connectivity",
            first_value: 0.931852158,
            second_key: "Network > VPN Issue",
            second_value: 0.048521441,
            third_key: "IT Support > Hardware",
            third_value: 0.019626401,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191509",
            Description: "New employee onboarding access",
            category: "Access Management",
            sub_category: "New Access",
            first_key: "Access Management > New Access",
            first_value: 0.945125199,
            second_key: "Access Management > SAP Access Request",
            second_value: 0.032111442,
            third_key: "Access Management > HR Portal Access",
            third_value: 0.022763359,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191522",
            Description: "Employee details correction in HRMS",
            category: "ERP updation",
            sub_category: "Personal Information change",
            first_key: "ERP updation > Personal Information change",
            first_value: 0.9612559,
            second_key: "ERP updation > Official information change",
            second_value: 0.0271441,
            third_key: "ERP updation > Leave Management",
            third_value: 0.0116001,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191537",
            Description: "Lotus Notes migration to Outlook",
            category: "Software",
            sub_category: "Application Migration",
            first_key: "Software > Application Migration",
            first_value: 0.95211452,
            second_key: "Software > Application Error",
            second_value: 0.0311211,
            third_key: "Email > Performance",
            third_value: 0.01676438,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191550",
            Description: "Server restart request",
            category: "IT Support",
            sub_category: "Server Maintenance",
            first_key: "IT Support > Server Maintenance",
            first_value: 0.94111234,
            second_key: "IT Support > Hardware",
            second_value: 0.0381187,
            third_key: "Network > Connectivity",
            third_value: 0.0207690,
            ticket_queue_status: "Ticket Routed to correct Queue",
            k_token: ""
        },
        {
            Ticket_ID: "2501191564",
            Description: "Remote desktop not accessible",
            category: "IT Support",
            sub_category: "Login Issue",
            first_key: "IT Support > Login Issue",
            first_value: 0.92541122,
            second_key: "IT Support > VPN Issue",
            second_value: 0.04518811,
            third_key: "Access Management > New Access",
            third_value: 0.02940067,
            ticket_queue_status: "Ticket is still in Queue",
            k_token: ""
        }
    ];

    return (
        <div className="card">
            <h2 className="table-header" >Predicted Data</h2>
            <DataTable value={tickets} paginator rows={5} responsiveLayout="scroll">
                <Column field="Ticket_ID" header="Ticket ID" sortable />
                <Column field="Description" header="Description" />
                <Column field="category" header="Category" sortable />
                <Column field="sub_category" header="Sub-Category" />
                <Column field="first_key" header="First Key" />
                <Column field="first_value" header="First Value" />
                <Column field="second_key" header="Second Key" />
                <Column field="second_value" header="Second Value" />
                <Column field="third_key" header="Third Key" />
                <Column field="third_value" header="Third Value" />
                <Column field="ticket_queue_status" header="Ticket Queue Status" />
                <Column field="k_token" header="K Token" />
            </DataTable>
        </div>
    );
}