import { useEffect } from "react";
import { fetchPhotos, fetchVideos } from "../api/mediaApi";
import { useSelector } from "react-redux";

const ResultGrid = () => {
  const { query, activeTab, results, loading, error } = useSelector(
    (store) => store.search
  );


  useEffect(function(){
    const getData = async () => {

    let data
    if (activeTab == "photos") {
            let response = await fetchPhotos(query);
            data = response.results.map((item) =>({
                id: item.id,
                type: "photo",
                thumbnail: item.urls.small,
                src:item.urls.full,
                title: item.alt_description
            }))
    }
    if (activeTab == "videos") {
       let response = await fetchVideos(query);
       data = response.videos.map((item) => ({
        id: item.id,
        type: "video",
        thumbnail: item.image,
        src: item.video_files[0].link,
        title: item.user.name
       }))
    }
    console.log(data);
    };
    getData()

  },[query, activeTab])

  return (
    <div>
      
    </div>
  );
};

export default ResultGrid;
