import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const IMG = "https://image.tmdb.org/t/p/w500";
const API = "https://api.themoviedb.org/3";
const KEY = "YOUR_TMDB_KEY";

type MobileMovie = {
  id: number;
  title?: string;
  poster_path?: string | null;
};

export default function App() {
  const [movies, setMovies] = useState<MobileMovie[]>([]);

  useEffect(() => {
    fetch(`${API}/trending/movie/week?api_key=${KEY}`)
      .then((r) => r.json())
      .then((data) => setMovies((data?.results || []).slice(0, 20)))
      .catch(() => setMovies([]));
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: "#05050a" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "900",
          marginBottom: 14,
        }}
      >
        Movie Galaxy Mobile
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {movies.map((m) => (
          <Pressable key={m.id} style={{ width: "48%" }}>
            <Image
              source={{
                uri: m.poster_path ? IMG + m.poster_path : undefined,
              }}
              style={{ width: "100%", height: 260, borderRadius: 16 }}
            />
            <Text style={{ color: "white", marginTop: 6 }} numberOfLines={1}>
              {m.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
