import {Text, View, Image, ActivityIndicator, FlatList} from "react-native";
import {useRouter} from "expo-router";
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import {useFetch} from "@/services/useFetch";
import {fetcMovies} from "@/services/api";
import MovieCard from "@/components/MovieCard";
import {getTrendingMovies} from "@/services/appWrite";
import TrendingCard from "@/components/TrendingCard";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetcMovies({query: ""}));

  const renderHeader = () => (
    <>
      <Image source={icons.logo} className="w-12 ht-10 mt-20 mb-5 mx-auto" />
      {moviesLoading || trendingLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : moviesError || trendingError ? (
        <Text className="text-white">
          Movies : {moviesError?.message || trendingError?.message}
        </Text>
      ) : (
        <View className="mt-5">
          <SearchBar
            onPress={() => router.push("/Search")}
            placeholder="Search for a Movie"
          />
          {trendingMovies && (
            <View className="mt-10">
              <Text className="text-lg text-white font-bold mb-3">
                Trending Movies
              </Text>
            </View>
          )}

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-4"></View>}
            className="mb-4 mt-3"
            data={trendingMovies}
            renderItem={({item, index}) => (
              <TrendingCard movie={item} index={index} />
            )}
            keyExtractor={(item) => Math.random().toString()}
          ></FlatList>
          <Text className="text-lg text-white font-bold mt-5 mb-3">
            Latest Movies
          </Text>
        </View>
      )}
    </>
  );

  return (
    <>
      <View className="flex-1 bg-primary">
        <Image source={images.bg} className="absolute w-full z-0"></Image>

        {moviesLoading || moviesError || trendingError || trendingLoading ? (
          <View className="flex-1 px-5">{renderHeader()}</View>
        ) : (
          <>
            <FlatList
              data={movies || []}
              renderItem={({item}) => <MovieCard {...item} />}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
              ListHeaderComponent={renderHeader}
              contentContainerStyle={{paddingBottom: 10}}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) =>
                item.id?.toString() || Math.random().toString()
              }
            />
          </>
        )}
      </View>
    </>
  );
}
