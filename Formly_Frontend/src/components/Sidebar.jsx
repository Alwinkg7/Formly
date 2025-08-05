import {
  PencilSquareIcon,
  DocumentTextIcon,
  RadioIcon,
  CheckCircleIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  'Text Input': <PencilSquareIcon className="w-5 h-5 mr-2" />,
  'Text Area': <DocumentTextIcon className="w-5 h-5 mr-2" />,
  'Radio Buttons': <RadioIcon className="w-5 h-5 mr-2" />,
  'Checkboxes': <CheckCircleIcon className="w-5 h-5 mr-2" />,
  'Scale Question': <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />,
};

export default function Sidebar({ addElement }) {
  const elements = [
    'Text Input',
    'Text Area',
    'Radio Buttons',
    'Checkboxes',
    'Scale Question'
  ];

  return (
    <div className="w-1/5 bg-white border-2 p-4 m-2 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Form Elements</h2>
      {elements.map(el => (
        <button
          key={el}
          onClick={() => addElement(el)}
          className="w-full bg-gray-100 hover:bg-gray-200 p-2 rounded mb-2 text-left flex items-center"
        >
          {iconMap[el]} {el}
        </button>
      ))}
    </div>
  );
}
