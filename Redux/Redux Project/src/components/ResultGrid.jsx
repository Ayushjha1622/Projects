import { useEffect } from "react";
import { fetchPhotos, fetchVideos } from "../api/mediaApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setLoading,
  setResults,
} from "../redux/features/searchSlice";
import ResultCard from "./ResultCard";

const ResultGrid = () => {
  const dispatch = useDispatch();
  const { query, activeTab, results, loading, error } = useSelector(
    (store) => store.search
  );

  useEffect(
    function () {
      if (!query) return 
      const getData = async () => {
        try {
          dispatch(setLoading());
          let data = [];
          if (activeTab == "photos") {
            let response = await fetchPhotos(query);
            data = response.results.map((item) => ({
              id: item.id,
              type: "photo",
              thumbnail: item.urls.small,
              src: item.urls.full,
              title: item.alt_description || 'photo',
              url: item.links.html
            }));
          }
          if (activeTab == "videos") {
            let response = await fetchVideos(query);
            data = response.videos.map((item) => ({
              id: item.id,
              type: "video",
              thumbnail: item.image,
              src: item.video_files[0].link,
              title: item.user.name || 'video',
              url: item.url
            }));
          }
          dispatch(setResults(data));
        } catch (err) {
          dispatch(setError(err.message));
        }
      };
      getData();
    },
    [query, activeTab, dispatch]
  );

  if (error) return <h1>Error</h1>;
  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="flex justify-between  w-full flex-wrap gap-6 overflow-auto px-10 ">
      {results.map((item, idx) => {
        return <div key={idx}>
        <a target="_blank" href={item.url}>  <ResultCard item={item}/></a>
        </div>
        
      })}
    </div>
  )
}

export default ResultGrid;
