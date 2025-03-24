"use client";

const DefaultAvatar: React.FC<{
    name: string;
    size?: number;
    textSize?: number;
    index?: number;
    isUser?: boolean;
}> = ({ name, size = 60, textSize = size / 2, index = 0, isUser = false }) => {
    const colors = [
        "bg-green-500",
        "bg-red-500",
        "bg-yellow-500",
        "bg-teal-500",
        "bg-indigo-500",
        "bg-orange-500",
        "bg-pink-500",
        "bg-purple-500",
        "bg-gray-500"
    ];
    const initial = name.charAt(0).toUpperCase();
    const backgroundColor = isUser ? "bg-sky-500" : colors[index % 9];

    return (
        <div
            className={`flex items-center justify-center text-white font-semibold uppercase rounded-full ${backgroundColor}  w-full h-full`}
            style={{
                fontSize: `${textSize}px`
            }}
        >
            {initial}
        </div>
    );
};

export default DefaultAvatar;
