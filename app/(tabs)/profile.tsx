import {View, Text, Image} from "react-native";
import React from "react";
import {icons} from "@/constants/icons";

const profile = () => {
  return (
    <View className="bg-primary flex-1 px-10">
      <View className="flex justify-center items-center flex-1 gap-5">
        <Image source={icons.person} className="size-10" tintColor="fff" />
        <Text className="text-gray-500 font-semibold"></Text>
      </View>
    </View>
  );
};

export default profile;
