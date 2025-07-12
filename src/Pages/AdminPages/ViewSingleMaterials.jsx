import React from 'react';
import { DocumentIcon, VideoCameraIcon, TrashIcon } from '@heroicons/react/24/outline';

const ViewSingleMaterials = ({ material, onDelete }) => {
    const getFileTypeIcon = () => {
        if (material.fileType?.includes('video')) {
            return <VideoCameraIcon className="h-5 w-5 text-red-500" />;
        }
        return <DocumentIcon className="h-5 w-5 text-blue-500" />;
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    {getFileTypeIcon()}
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {material.title || 'Untitled Material'}
                        </div>
                        <div className="text-sm text-gray-500">
                            {material.description || 'No description'}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{material.tutorEmail}</div>
                <div className="text-sm text-gray-500">
                    {material.tutorName || 'Unknown Tutor'}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {material.fileType || 'Unknown'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-900 flex items-center"
                    title="Delete material"
                >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default ViewSingleMaterials;