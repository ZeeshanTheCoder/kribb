import FeaturedCard from "@/components/FeaturedCard";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = React.useState<Property[]>([]);
  const [recommended, setRecommended] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);


  const fetchProperties = async () => {
    try {
      setLoading(true);

      const { data: featuredData, error: featuredError } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      if (featuredError) {
        console.error("Featured properties error:", featuredError);
        return;
      }

      const { data: recommendedData, error: recommendedError } =
        await supabase
          .from("properties")
          .select("*")
          .eq("is_featured", false)
          .order("created_at", { ascending: false });

      if (recommendedError) {
        console.error("Recommended properties error:", recommendedError);
        return;
      }

      setFeatured(featuredData ?? []);
      setRecommended(recommendedData ?? []);

    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [])
  );


  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={["top", "left", "right"]}
    >
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header content */}
            <View className="flex-row items-center justify-between px-5 pb-5 pt-4">
              <Image
                source={require("../../../assets/images/kribb.png")}
                style={{ width: 90, height: 36 }}
                resizeMode="contain"
              />

              <View className="items-end">
                <Text>
                  Good Morning 👋
                </Text>
                <Text className="text-gray-900 text-base font-bold" >
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>


            {/* Search bar */}

            <TouchableOpacity
              className="mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2
              }}
              onPress={() => router.push('/(root)/(tabs)/search')}>
              <Ionicons name="search-outline" size={18} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm flex-1">
                Search properties, cities...
              </Text>

              <TouchableOpacity
                onPress={() => router.push('/(root)/(tabs)/search?openFilters=true')}
                className="w-8 h-8 bg-blue-600 rounded-xl items-center justify-center"
              >
                <Ionicons name="options-outline" size={15} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>


            {/* Featured section */}

            <View className="mb-6">
              <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
                Featured
              </Text>

              {loading ?
                <ActivityIndicator size="small"
                  color="#2563EB"
                  className="py-10" />
                :
                <FlatList
                  data={featured}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <FeaturedCard property={item} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                />
              }

            </View>


            {/* Recommended Header */}

            <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
              Recommended
            </Text>

          </View>
        }

        renderItem={({ item }) => (
          <View className="px-5">
            <PropertyCard property={item} />
          </View>
        )}

        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400"> No properties found</Text>
            </View>
          ) : null
        }

      />
    </SafeAreaView>
  );
}
