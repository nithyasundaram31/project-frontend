import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = ({ activities }) => {
  console.log("Received activities:", activities); 

  if (!Array.isArray(activities)) {
    return <p className="text-red-500">Invalid activity data.</p>;
  }

  const filteredActivities = activities
    .filter((activity) => activity && activity.studentId && activity.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((activity, index, self) =>
      index === self.findIndex((a) =>
        a.studentId?._id === activity.studentId?._id &&
        a.activityType === activity.activityType &&
        a.exam === activity.exam
      )
    )
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-64 scrollbar-hide">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity._id} className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <p>
                <span className="font-medium">{activity.studentId?.name || 'Unknown'}</span>{' '}
                <span>{activity.activityType || 'did something'}</span>{' '}
                <span className="font-medium">{activity.exam || 'an exam'}</span>{' '}
                <span className="text-gray-500">
                  {activity.createdAt
                    ? formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })
                    : 'some time ago'}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p>No activities found.</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
