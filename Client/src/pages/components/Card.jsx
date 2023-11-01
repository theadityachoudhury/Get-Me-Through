import { Link } from "react-router-dom";

const Card = ({ title, description, link, buttonData }) => {
	return (
		<div className="w-96 h-96 rounded-lg shadow-xxl bg-gray-300 flex flex-col justify-center items-center ml-16 mb-6">
			<div className="font-bold text-2xl mb-4 text-center">{title}</div>
			<p className="text-gray-700 text-base text-center">{description}</p>
			<div className="mt-4">
				<Link to={link}>
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						{buttonData}
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Card;
