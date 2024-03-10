import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Text } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from 'firebase/database';

const firebaseConfig = JSON.parse(process.env.EXPO_PUBLIC_FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {

  const [product, setProduct] = useState({
    title: '',
    amount: ''
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    onValue(ref(database, '/listItems'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(Object.values(data));
      }
    })
  }, []);

  const handleSave = () => {
    console.log(product);
    push(ref(database, '/listItems'), product);
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={product.title}
        onChangeText={(value => setProduct({ ...product, title: value }))}
        placeholder="Product title"
      />

      <TextInput
        value={product.amount}
        onChangeText={(value => setProduct({ ...product, amount: value }))}
        placeholder="Product amount"
      />

      <Button
        title="Save"
        onPress={handleSave}
      />

      <FlatList
        data={products}
        renderItem={({ item }) => <Text>{item.title} {item.amount}</Text>}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
