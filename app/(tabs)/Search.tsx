import {View, Text, Image, FlatList, ActivityIndicator} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {images} from "@/constants/images";
import {useFetch} from "@/services/useFetch";
import {fetcMovies} from "@/services/api";
import MovieCard from "@/components/MovieCard";
import {icons} from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import {useDebounce} from "use-debounce";
import {updateSearchCount} from "@/services/appWrite";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  // FIX 1: Make the fetch function stable so 'refetchMovies' doesn't change on every render
  const fetchFunction = useCallback(() => {
    return fetcMovies({query: debouncedQuery});
  }, [debouncedQuery]);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    fetchData: refetchMovies,
  } = useFetch(fetchFunction, false);

  // FIX 2: Handle side effects safely
  useEffect(() => {
    // Call the API
    refetchMovies();
  }, [debouncedQuery, refetchMovies]); // Now refetchMovies is stable!

  // FIX 3: Separate analytics side effect (AppWrite) to avoid mixed concerns
  useEffect(() => {
    const tt = async () => {
      if (movies && movies.length > 0 && debouncedQuery) {
        await updateSearchCount(debouncedQuery, movies[0]);
      }
    };
    tt();
  }, [movies]);
  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      ></Image>
      {moviesLoading ? (
        <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
      ) : (
        <FlatList
          data={movies || []}
          renderItem={({item}) => <MovieCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          className="px-5"
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start", // Changed from center to align better
            gap: 16,
            marginVertical: 16,
          }}
          contentContainerStyle={{paddingBottom: 100}}
          ListHeaderComponent={
            <>
              <View className="w-full flex-row justify-center mt-20 items-center">
                <Image source={icons.logo} className="w-12 h-10"></Image>
              </View>
              <View className="my-5">
                <SearchBar
                  placeholder="Search Movies..."
                  value={searchQuery}
                  onChangeText={(text: string) => setSearchQuery(text)}
                />
              </View>
              {moviesLoading && (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  className="my-3"
                />
              )}
              {moviesError && (
                <Text className="text-red-500 px-5 my-3">
                  Error: {moviesError?.message}
                </Text>
              )}
              {!moviesLoading &&
                !moviesError &&
                searchQuery.trim() &&
                movies?.length > 0 && (
                  <Text className="text-xl text-white font-bold">
                    Search Results for{" "}
                    <Text className="text-accent">{searchQuery}</Text>
                  </Text>
                )}
            </>
          }
          ListEmptyComponent={
            !moviesLoading && !moviesError ? (
              <View className="mt-10 px-5">
                <Text className="text-center text-gray-500">
                  {searchQuery.trim()
                    ? "No Movies found"
                    : "Search for a movie"}
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default Search;
