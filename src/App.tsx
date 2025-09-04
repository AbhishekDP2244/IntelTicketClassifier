// import './App.css'
import TicketClassifier from './TicketClassifier'
import './Styles/custom-styles.scss';
import './Styles/KnowYourApplication.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const rowData = {
    case_factory_filters_names: "Operations Journey",
    case_factory_subfilters_name: "All",
    category: "application",
    coming_soon: 0,
    create_time: "2024-06-08T20:08:48",
    description:
      "Intelligent Ticket Classification  is a groundbreaking tool that leverages Artificial Intelligence (AI) to automate the categorization of support tickets with precision and efficiency.",
    developer_manual:
      "https://prodaptcloud.sharepoint.com/sites/NextGenLabs/Synapt%20Hub/Forms/AllItems.aspx?id=%2Fsites%2FNextGenLabs%2FSynapt%20Hub%2FSynapt%2DHub%2FFault%20Lens%2FSynapt%5FFaultlens%5FDeveloper%5FManual%20%2Epdf&parent=%2Fsites%2FNextGenLabs%2FSynapt%20Hub%2FSynapt%2DHub%2FFault%20Lens&isSPOFile=1&OR=Teams%2DHL&CT=1714646974280&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNDAzMzEwMTgxNyIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D",
    dislikes: 0,
    example_descriptions: [
      "We have done so and got approval from the user tea…ed mail for your reference. Ticket id : 240152241",
      "Hi Team,Please provide access card for the below n…Designation: Lead Architect\nProject Name: Verizon",
      "Hi Team,\nM-Pesa (USA) team is facing FortiClient V…know if required any details.\nThanks,\nAnil kumar\n",
      "Hi Team,\nThe below user is facing second monitor i…-001\nPlace:Chennai1 6th floor\nContact:9272727237\n",
    ],
    example_titles: [
      "Backend Approval Status Update",
      "Access Card Request for New Joiners",
      "FortiClient VPN Issue",
      "Second Monitor Issue",
    ],
    filter_description:
      "Operations Journey is a powerful suite of tools designed to enhance operational efficiency and improve service delivery.Together,these widgets empower teams to optimize support processes,enhance customer satisfaction,and ensure smooth operations.",
    icon_url:
      "https://synapt.prodapt.com/synaptframework/download/icon/fault_lens.png",
    is_liked_by_user: null,
    likes: 8,
    long_description:
      "Intelligent Ticket Classification  is a groundbreaking tool that leverages Artificial Intelligence (AI) to automate the categorization of support tickets with precision and efficiency.",
    mst_case_factory_filters_id: 9,
    mst_case_factory_subfilters_id: 31,
    objid: 3,
    order_id: 1,
    orginator2user: 1,
    sub_filter_description: null,
    swagger_url: "https://synapt-dev.prodapt.com/synaptfaultlens/docs",
    title: "Intelligent Ticket Classification",
    user_manual:
      "https://prodaptcloud.sharepoint.com/sites/NextGenLabs/Synapt%20Hub/Forms/AllItems.aspx?id=%2Fsites%2FNextGenLabs%2FSynapt%20Hub%2FSynapt%2DHub%2FFault%20Lens%2FSynapt%5FFaultlens%5FUser%5FManual%2Epdf&parent=%2Fsites%2FNextGenLabs%2FSynapt%20Hub%2FSynapt%2DHub%2FFault%20Lens",
    video_url: null,
    view_count: 696,
    yammer_community:
      "https://engage.cloud.microsoft/main/groups/eyJfdHlwZSI6Ikdyb3VwIiwiaWQiOiIxODU3OTg2ODA1NzYifQ/all",
  };

  return (
    <>
      <div className='appcontainer'>

        <TicketClassifier props={rowData} onClose={() => {console.log("Closed");}} />
      </div>
    </>
  )
}

export default App
