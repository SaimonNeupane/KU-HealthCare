
import Sidebar from "../../components/Sidebar/Sidebar"
import Notifications from "../../components/DashBoard/Notification";
import StatsCards from "../../components/DashBoard/Statcard";

const AdminPage = () =>{
    return(
        <div>
            <Sidebar/>
            <main>
                <h2>DashBoard</h2>
                <div>
                    <StatsCards/>
                </div>
                <div>
                    <Notifications/>
                </div>
            </main>
        </div>
    )
}

export default AdminPage;