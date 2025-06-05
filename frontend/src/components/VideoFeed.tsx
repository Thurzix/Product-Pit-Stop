import VideoCard from './videocard';

// dados de teste, usando os arquivos que você colocou em public/videos/
const sampleVideos = [
  {
    thumbnail: '/videos/thumb1.jpg',
    videoUrl: '/videos/exemplo1.mp4',
    title: 'Demonstração de Produto 1',
    author: 'Arthur',
  },
  {
    thumbnail: '/videos/thumb2.jpg',
    videoUrl: '/videos/exemplo2.mp4',
    title: 'Demonstração de Produto 2',
    author: 'Maria',
  },
];

export default function VideoFeed() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {sampleVideos.map((video, idx) => (
        <VideoCard
          key={idx}
          thumbnail={video.thumbnail}
          videoUrl={video.videoUrl}
          title={video.title}
          author={video.author}
        />
      ))}
    </div>
  );
}
