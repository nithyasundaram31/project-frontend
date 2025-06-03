import { Link } from "react-router-dom";

const StatsCard = ({ title, value, icon: Icon, trend, bgColor }) => {
    // absolute path for links
    const viewLink =
        title === "Total Students"
            ? "/admin/dashboard/students"
            : "/admin/dashboard/exams";

    return (
        <div className={`${bgColor} p-6 rounded-lg shadow-lg`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-black text-sm">{title}</p>
                    <h3 className="text-2xl font-bold mt-2">{value}</h3>
                    <Link to={viewLink} className="text-black text-sm hover:underline">
                        {title === "Total Students" ? "View Students →" : "View Exam →"}
                    </Link>
                </div>
                <Icon className="h-8 w-8 text-blue-500" />
            </div>
        </div>
    );
};

export default StatsCard;
