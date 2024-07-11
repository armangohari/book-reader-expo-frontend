import { axiosBase } from "@/services/axiosBase";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { API_BASE_URL } from "@/config/apiConfig";
import * as WebBrowser from "expo-web-browser";
import { useIsFocused } from "@react-navigation/native";

type Book = {
  id?: number;
  uuid: string;
  title: string;
  description: string;
  localPath: string;
  uploadedBy: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchAllBooks();
    }
  }, [isFocused]);

  const fetchAllBooks = async () => {
    await axiosBase
      .get("/books/all")
      .then((res) => {
        if (res?.status === 200) {
          setBooks(res?.data);
        }
      })
      .catch((err) => {
        console.error("Error in fetching all books: ", err);
      });
  };

  const handleDownloadAsync = async (fileName: string) => {
    try {
      const downloadUri = `${API_BASE_URL}/books/${fileName}`;
      await WebBrowser.openBrowserAsync(downloadUri);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to download or open PDF");
    }
  };

  const BookCard = ({ uuid, title, description, uploadedBy }: Book) => {
    return (
      <View className="bg-white rounded-xl flex-1 justify-center items-center p-5 gap-2.5 shadow-sm mx-4 my-2">
        <Text className="text-xl font-bold">{title}</Text>
        <Text className="text-sm text-gray-500">{description}</Text>
        <Text className="text-xs text-gray-400">
          uploaded by: @{uploadedBy}
        </Text>
        <Pressable
          className="bg-primary py-2 px-4 rounded-lg text-center"
          onPress={() => handleDownloadAsync(`${uuid}.pdf`)}
        >
          <Text className="text-white text-base">Download</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View className="w-full flex-1 items-center">
      <ScrollView>
        {books.map((book) => (
          <BookCard
            key={book.id}
            uuid={book.uuid}
            title={book.title}
            description={book.description}
            localPath={book.localPath}
            uploadedBy={book.uploadedBy}
          />
        ))}

        {/* Bottom Navbar Placeholder */}
        <View className="h-[72px]" />
      </ScrollView>
    </View>
  );
}
