type VideoCardProps = {
    thumbnail: string;
    videoUrl: string;
    title: string;
    author: string;
  };
  
  export default function VideoCard({ thumbnail, videoUrl, title, author }: VideoCardProps) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <video
          poster={thumbnail}
          controls
          className="w-full h-64 object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
          Seu navegador não suporta vídeo.
        </video>
        <div className="p-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">por {author}</p>
        </div>
      </div>
    );
  }
  