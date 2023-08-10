// import React, { useRef } from "react";
// import { Paystack, paystackProps } from "react-native-paystack-webview";
// import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

// export default function Payment() {
//   const paystackWebViewRef = useRef(paystackProps.PayStackRef);

//   return (
//     <View style={{ marginHorizontal: 15 }}>
//       <Paystack
//         paystackKey="pk_test_9bd0b90f467cc03ec7bc74e417b58fb978f6da87"
//         paystackSecretKey="sk_test_43d3ca891624d90232ff726ab9012234efcbae1f"
//         billingEmail="letlhogonolo.moroke8@gmail.com"
//         billingName="Letlhogogonolo Tlhogi"
//         billingMobile="0676260399"
//         amount={1000}
//         currency="ZAR"
//         onCancel={(e) => {
//           console.log(e);
//         }}
//         onSuccess={(res) => {
//           console.log(res);
//         }}
//         ref={paystackWebViewRef}
//       />
//       <TouchableOpacity
//         onPress={() => paystackWebViewRef.current.startTransaction()}
//         style={styles.paystack}
//       >
//         <Text style={styles.pay}>Pay Now</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   paystack: {
//     minWidth: "60%",
//     backgroundColor: "#F9A826",
//     padding: 10,
//     borderRadius: 15,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   pay: {
//     color: "white",
//   },
// });

// ..........................................................................//

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

  const handleOnchange = (text, input) => {
    setBillingDetail((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleSubmit = () => {
    if (
      billingDetail.billingName &&
      billingDetail.billingEmail &&
      billingDetail.billingMobile
    ) {
      setPay(true);
    } else {
      Toast.show("Fill in all fields", {
        duration: Toast.durations.LONG,
      });
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
            value={billingDetail?.billingName}
          />
          <TextInput
            style={styles.input}
            placeholder="Billing Email"
            onChangeText={(text) => handleOnchange(text, "billingEmail")}
            value={billingDetail?.billingEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Billing Mobile"
            onChangeText={(text) => handleOnchange(text, "billingMobile")}
            value={billingDetail?.billingMobile}
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
                billingEmail={billingDetail.billingEmail}
                billingMobile={billingDetail.billingMobile}
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
