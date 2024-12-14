import React, { memo, useEffect, useState } from "react";
import { Image, View, StyleSheet, Text, ImageSourcePropType } from "react-native";

import type { Screen } from "@/router/helpers/types";
import { ScrollView } from "react-native-gesture-handler";
import { NativeItem, NativeList, NativeListHeader, NativeText } from "@/components/Global/NativeComponents";
import { Info } from "lucide-react-native";

const IdentityProviderSelector: Screen<"IdentityProviderSelector"> = ({ navigation }) => {
  const universityProviders = [
    {
      name: "univ_lorraine",
      title: "Université de Lorraine",
      description: "Utilise ton compte Sésame pour te connecter",
      image: require("@/../assets/images/service_ulorraine.png"),
      instanceURL: "https://mobile-back.univ-lorraine.fr",
      navigate: (instanceURL: string, title: string, image: ImageSourcePropType) => navigation.navigate("Multi_Login", { instanceURL, title, image }),
    },
    {
      name: "univ_unimes",
      title: "Université de Nîmes",
      description: "Utilise ton compte Sésame pour te connecter",
      image: require("@/../assets/images/service_unimes.png"),
      instanceURL: "https://mobile-back.unimes.fr",
      navigate: (instanceURL: string, title: string, image: ImageSourcePropType) => navigation.navigate("Multi_Login", { instanceURL, title, image }),
    },
    {
      name: "univ_uphf",
      title: "Université Polytechnique Hauts-de-France",
      description: "Utilise ton compte UPHF pour te connecter",
      image: require("@/../assets/images/service_uphf.png"),
      instanceURL: "https://appmob.uphf.fr/backend",
      navigate: (instanceURL: string, title: string, image: ImageSourcePropType) => navigation.navigate("Multi_Login", { instanceURL, title, image }),
    },
    {
      name: "iut_lannion",
      title: "IUT de Lannion",
      description: "Utilise ton compte Université Rennes 1 pour te connecter",
      image: require("@/../assets/images/service_iutlan.png"),
      navigate: () => navigation.navigate("UnivIUTLannion_Login"),
    },
  ];

  const identityProviders = [
    {
      name: "univ_rennes1",
      title: "Université Rennes 1",
      description: "Utilise ton compte Sésame pour te connecter",
      image: require("@/../assets/images/service_rennes1.png"),
      navigate: () => navigation.navigate("UnivRennes1_Login"),
    },
    {
      name: "univ_rennes2",
      title: "Université Rennes 2",
      description: "Utilise ton compte Sésame pour te connecter",
      image: require("@/../assets/images/service_rennes2.png"),
      navigate: () => navigation.navigate("UnivRennes2_Login"),
    },
    {
      name: "univ_limoges",
      title: "Université de Limoges",
      description: "Utilise ton compte Biome pour te connecter",
      image: require("@/../assets/images/service_unilim.png"),
      navigate: () => navigation.navigate("UnivLimoges_Login"),
    },
    {
      name: "univ_sorbonne_paris_nord",
      title: "Université Sorbonne Paris Nord",
      description: "Utilises ton compte Sorbonne pour te connecter",
      image: require("@/../assets/images/service_uspn.png"),
      navigate: () => navigation.navigate("UnivSorbonneParisNord_login"),
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingTop: 0 }}
    >
      <NativeListHeader label="Service universitaire disponible" />

      <NativeList>
        {universityProviders.map((identityProvider) => (
          <NativeItem
            key={identityProvider.name}
            onPress={() => identityProvider.navigate(identityProvider.instanceURL || "", identityProvider.title, identityProvider.image)}
            leading={<Image source={identityProvider.image} style={{ width: 40, height: 40, borderRadius: 10 }} />}
          >
            <NativeText variant="title">{identityProvider.title}</NativeText>
            <NativeText variant="subtitle">
              {identityProvider.description}
            </NativeText>
          </NativeItem>
        ))}
      </NativeList>

      <NativeListHeader label="Fournisseurs disponibles" />

      <NativeList>
        {identityProviders.map((identityProvider) => (
          <NativeItem
            key={identityProvider.name}
            onPress={() => identityProvider.navigate()}
            leading={<Image source={identityProvider.image} style={{ width: 40, height: 40, borderRadius: 10 }} />}
          >
            <NativeText variant="title">{identityProvider.title}</NativeText>
            <NativeText variant="subtitle">
              {identityProvider.description}
            </NativeText>
          </NativeItem>
        ))}
      </NativeList>


      <NativeList inline>
        <NativeItem
          icon={<Info />}
        >
          <NativeText variant="subtitle">
            Les founisseurs d'identité ne fournissent pas de données (calendrier, notes, etc...) mais permettent de te connecter à l'application.
          </NativeText>
        </NativeItem>
      </NativeList>

    </ScrollView>
  );
};

export default IdentityProviderSelector;
