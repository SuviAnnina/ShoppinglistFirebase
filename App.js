import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Text } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';

const firebaseConfig = JSON.parse(process.env.EXPO_PUBLIC_FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {

  const [product, setProduct] = useState({
    title: '',
    amount: '',
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    onValue(ref(database, '/products'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.entries(data).map(([key, value]) => ({
          key: key,
          ...value
        }));
        setProducts(items);
      } else {
        setProducts([]);
      }
    });
  }, []);


  const handleSave = () => {
    push(ref(database, '/products'), product);
  };

  const handleDelete = (productKey) => {
    remove(ref(database, `/products/${productKey}`))
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
        renderItem={({ item }) => (
          <View>
            <Text>{item.title} {item.amount} </Text>
            <Button title="Delete" onPress={() => handleDelete(item.key)} />
          </View>
        )}
        keyExtractor={(item) => item.key}
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
