import axiosBase from "@/services/axiosBase";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
// import { WebView } from "react-native-webview";
import { API_BASE_URL } from "@/config/apiConfig";
import * as WebBrowser from "expo-web-browser";
import * as FileSystem from "expo-file-system";

type Book = {
  id: number;
  title: string;
  description: string;
  localPath: string;
  uploadedBy: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [fileUri, setFileUri] = useState("");

  useEffect(() => {
    checkIfFileExists();
  }, []);

  const checkIfFileExists = async () => {
    const fileInfo = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + "pdf name"
    );
    if (fileInfo.exists) {
      setIsDownloaded(true);
      setFileUri(fileInfo.uri);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    await axiosBase
      .get("/books/all")
      .then((res) => {
        if (res?.status === 200) {
          console.log(res.data);
          setBooks(res?.data);
        }
      })
      .catch((err) => {
        console.error("Error in fetching all books: ", err);
      });
  };

  // const handleDownloadAsync = async () => {
  //   try {
  //     const downloadResumable = FileSystem.createDownloadResumable(
  //       PDF_URL,
  //       FileSystem.documentDirectory + PDF_FILE_NAME,
  //       {},
  //       (downloadProgress) => {
  //         const progress =
  //           downloadProgress.totalBytesWritten /
  //           downloadProgress.totalBytesExpectedToWrite;
  //         console.log(`Progress: ${progress * 100}%`);
  //       }
  //     );

  //     const { uri } = await downloadResumable.downloadAsync();
  //     setIsDownloaded(true);
  //     setFileUri(uri);
  //     Alert.alert("Download Complete", "PDF file downloaded successfully");
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Download Failed", "There was an error downloading the file");
  //   }
  // };

  const handleDownloadAsync = async (id: number, title: string) => {
    try {
      const downloadUri = `${API_BASE_URL}/books/${id}`;
      // const downloadUri = `http://192.168.100.2:3000/api/books/${id}`;
      await WebBrowser.openBrowserAsync(downloadUri);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to download or open PDF");
    }
  };

  const BookCard = ({ id, title, description, uploadedBy }: Book) => {
    return (
      <View className="bg-white rounded-xl flex-1 justify-center items-center p-5 gap-2.5 shadow-sm mx-4 my-2">
        <Text className="text-xl font-bold">{title}</Text>
        <Text className="text-sm text-gray-500">{description}</Text>
        <Text className="text-xs text-gray-400">
          uploaded by: @{uploadedBy}
        </Text>
        <Pressable
          className="bg-primary py-2 px-4 rounded-lg text-center"
          onPress={() => handleDownloadAsync(id, title)}
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
            title={book.title}
            id={book.id}
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

// function PDFViewer({ pdfFileName }: { pdfFileName: string }) {
//   const [pdfUri, setPdfUri] = useState("");

//   useEffect(() => {
//     const pdfWebUri = `file:///android_asset/${pdfFileName}`;
//     setPdfUri(pdfWebUri);
//   }, [pdfFileName]);

//   return (
//     <View style={styles.container}>
//       {pdfUri ? (
//         <WebView source={{ uri: pdfUri }} style={styles.webView} />
//       ) : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   webView: {
//     flex: 1,
//   },
// });
