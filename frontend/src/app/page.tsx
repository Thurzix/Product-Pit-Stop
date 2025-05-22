import Header from '../components/Header';
import VideoFeed from '../components/VideoFeed';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Feed de Vídeos</h1>
        <VideoFeed />
      </main>
    </div>
  );
}
