import React from "react";
import { useState } from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-root-toast";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
} from "react-native";
import { Paystack } from "react-native-paystack-webview";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Payment() {
  const [pay, setPay] = useState(false);
  const [billingDetail, setBillingDetail] = useState({
    billingName: "",
    billingEmail: "",
    billingMobile: "",
    // amount: "",
  });

  const { params } = useRoute();
  const total = params?.total || 0;

  const [userDetails, setUserDetails] = React.useState();
  React.useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData) {
      setUserDetails(JSON.parse(userData));
    }
  };

  const handleOnchange = (text, input) => {
    setBillingDetail((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleSubmit = () => {
    if (userDetails?.fullname && userDetails?.email && userDetails?.phone) {
      setPay(true);
    }
  };

  return (
    <RootSiblingParent>
      <ScrollView>
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Checkout Payment</Text>
        </View>
        <View style={styles.body}>
          <TextInput
            style={styles.input}
            placeholder="Billing Name"
            onChangeText={(text) => handleOnchange(text, "billingName")}
            value={userDetails?.fullname}
          />
          <TextInput
            style={styles.input}
            placeholder="Billing Email"
            onChangeText={(text) => handleOnchange(text, "billingEmail")}
            value={userDetails?.email}
          />
          <TextInput
            style={styles.input}
            placeholder="Billing Mobile"
            onChangeText={(text) => handleOnchange(text, "billingMobile")}
            value={userDetails?.phone}
          />
          {/* <TextInput
            style={styles.input}
            placeholder="Amount"
            onChangeText={() => handleOnchange( "amount")}
            value={billingDetail?.amount}
          /> */}

          <Button
            title="Pay Now"
            color="#5D5FEE"
            accessibilityLabel="pay now"
            onPress={handleSubmit}
          />

          {pay && (
            <View style={{ flex: 1 }}>
              <Paystack
                paystackKey="pk_test_9bd0b90f467cc03ec7bc74e417b58fb978f6da87"
                billingName={userDetails?.fullname}
                billingEmail={userDetails?.email}
                billingMobile={userDetails?.phone}
                currency="ZAR"
                amount={total * 1}
                activityIndicatorColor="green"
                onCancel={(e) => {
                  console.log(e);
                  Toast.show("Transaction Cancelled!!", {
                    duration: Toast.durations.LONG,
                  });
                }}
                onSuccess={(response) => {
                  console.log(response);

                  const responseObject = response["transactionRef"]["message"];
                  if (responseObject === "Approved") {
                    Toast.show("Transaction Approved!!", {
                      duration: Toast.durations.LONG,
                    });
                  }
                }}
                autoStart={pay}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: "#fff",
    height: 95,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#5D5FEE",
  },
  body: {
    padding: 10,
  },
  input: {
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
    marginTop: 15,
  },
});
