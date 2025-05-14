import Header from "../components/header";
import Sidebar from "../components/sidebar";
import VideoFeed from "../components/videofeed";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <VideoFeed />
        {/* Futuro: barra lateral direita com botões de loja */}
      </div>
    </div>
  );
}
