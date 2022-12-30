/* eslint-disable no-console */
import { CredentialState } from '@aries-framework/core'
import { useCredentialByState } from '@aries-framework/react-hooks'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SectionList,
  StyleSheet,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Linking,
  Button,
} from 'react-native'
import { getVersion, getBuildNumber } from 'react-native-device-info'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { useConfiguration } from '../contexts/configuration'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { Locales } from '../localization'
import { GenericFn } from '../types/fn'
import { Screens, SettingStackParams, Stacks } from '../types/navigators'
import { SettingSection } from '../types/settings'
import { testIdWithKey } from '../utils/testable'

type SettingsProps = StackScreenProps<SettingStackParams>

const touchCountToEnableBiometrics = 9

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation()

  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ]

  const [store, dispatch] = useStore()
  const developerOptionCount = useRef(0)
  const [developerModeTriggerDisabled, setDeveloperModeTriggerDisabled] = useState<boolean>(false)
  const { SettingsTheme, TextTheme, ColorPallet, Assets } = useTheme()
  const { settings } = useConfiguration()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenRes, setModalOpenRes] = useState(false)
  const [pass, setPass] = useState('')
  const [resPass, setResPass] = useState('')
  const languages = [
    { id: Locales.en, value: t('Language.English') },
    { id: Locales.fr, value: t('Language.French') },
    { id: Locales.ptBr, value: t('Language.Portuguese') },
  ]
  const styles = StyleSheet.create({
    container: {
      backgroundColor: ColorPallet.brand.primaryBackground,
      width: '100%',
    },
    section: {
      backgroundColor: SettingsTheme.groupBackground,
      paddingHorizontal: 25,
      paddingVertical: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 0,
      marginBottom: -11,
    },
    sectionSeparator: {
      marginBottom: 10,
    },
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemSeparator: {
      borderBottomWidth: 1,
      borderBottomColor: ColorPallet.brand.primaryBackground,
      marginHorizontal: 25,
    },
    logo: {
      height: 64,
      width: '50%',
      marginVertical: 16,
    },
    footer: {
      marginVertical: 25,
      alignItems: 'center',
    },
  })

  const currentLanguage = languages.find((l) => l.id === i18n.language)?.value

  const incrementDeveloperMenuCounter = () => {
    if (developerOptionCount.current >= touchCountToEnableBiometrics) {
      setDeveloperModeTriggerDisabled(true)
      dispatch({
        type: DispatchAction.ENABLE_DEVELOPER_MODE,
        payload: [true],
      })

      return
    }

    developerOptionCount.current = developerOptionCount.current + 1
  }
  const handleBackUp = async () => {
    // console.log(credentials)
    setModalOpen(false)
    const data = {
      credential: credentials,
      password: pass,
    }
    fetch('https://49a4-37-111-200-21.in.ngrok.io/api/data/vc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(await Linking.openURL('https://4043-37-111-200-21.in.ngrok.io'))
    setPass('')
  }
  // console.log(resPass.length)
  const handleRestorePass = async () => {
    // console.log(resPass)
    setModalOpenRes(false)
    const data = {
      password: resPass,
    }
    fetch('https://49a4-37-111-200-21.in.ngrok.io/api/data/restoreSetPass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setResPass('')

    await Linking.openURL('https://4043-37-111-200-21.in.ngrok.io')
      .then(
        async () =>
          await fetch('https://49a4-37-111-200-21.in.ngrok.io/api/data/restoreGetVc', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
      )
      // eslint-disable-next-line no-console
      .then(
        async (res) =>
          await res.json().then(async (data) => {
            // eslint-disable-next-line no-console, prettier/prettier
            const allVC = data.restoreDataArray
            // eslint-disable-next-line no-var
            const VC_size = JSON.parse(allVC)
            console.log(allVC)
            // eslint-disable-next-line prettier/prettier
            for (let i = 0; i < Object.keys(VC_size).length; i++) {
              const VC = JSON.parse(allVC)[i]
              // console.log(i + ' VC: ')
              // console.log(VC)
              // console.log(VC['metadata']['_internal/indyRequest']['master_secret_blinding_data'])
            }
            const VC1 = VC_size[3]
            // VC1['state'] = CredentialState.OfferReceived
            // VC1['_tags']['state'] = CredentialState.OfferReceived
            // console.log(VC1.id)
            // console.log(VC1)
            console.log(VC1)
          })
      )
  }

  const settingsSections: SettingSection[] = [
    {
      header: {
        icon: 'apartment',
        title: t('Screens.Contacts'),
      },
      data: [
        {
          title: t('Screens.Contacts'),
          accessibilityLabel: t('Screens.Contacts'),
          testID: testIdWithKey('Contacts'),
          onPress: () =>
            navigation
              .getParent()
              ?.navigate(Stacks.ContactStack, { screen: Screens.Contacts, params: { navigation: navigation } }),
        },
        {
          title: t('Settings.WhatAreContacts'),
          accessibilityLabel: t('Settings.WhatAreContacts'),
          testID: testIdWithKey('WhatAreContacts'),
          onPress: () => null,
          value: undefined,
        },
      ],
    },
    {
      header: {
        icon: 'settings',
        title: t('Settings.AppSettings'),
      },
      data: [
        {
          title: t('Global.Biometrics'),
          value: store.preferences.useBiometry ? t('Global.On') : t('Global.Off'),
          accessibilityLabel: t('Global.Biometrics'),
          testID: testIdWithKey('Biometrics'),
          onPress: () => navigation.navigate(Screens.UseBiometry),
        },
        // TODO: Need to resolve methods for changing PIN
        // {
        //   title: t('PinCreate.ChangePIN'),
        //   accessibilityLabel: t('PinCreate.ChangePIN'),
        //   testID: testIdWithKey('ChangePIN'),
        //   onPress: () => navigation.navigate(Screens.RecreatePin),
        // },
        {
          title: t('Settings.Language'),
          value: currentLanguage,
          accessibilityLabel: t('Settings.Language'),
          testID: testIdWithKey('Language'),
          onPress: () => navigation.navigate(Screens.Language),
        },
        {
          title: t('Settings.Backup'),
          accessibilityLabel: t('Settings.Backup'),
          onPress: () => (JSON.stringify(credentials) === '{}' ? setModalOpen(false) : setModalOpen(true)),
        },
        {
          title: t('Settings.Restore'),
          accessibilityLabel: t('Settings.Restore'),
          onPress: () => setModalOpenRes(true),
        },
      ],
    },
    ...(settings || []),
  ]

  if (store.preferences.developerModeEnabled) {
    const section = settingsSections.find((item) => item.header.title === t('Settings.AppSettings'))
    if (section) {
      section.data = [
        ...section.data,
        {
          title: t('Settings.Developer'),
          accessibilityLabel: t('Settings.Developer'),
          testID: testIdWithKey('Developer'),
          onPress: () => navigation.navigate(Screens.Developer),
        },
      ]
    }
  }

  const SectionHeader: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
    <View style={[styles.section, styles.sectionHeader]}>
      <Icon name={icon} size={24} style={{ marginRight: 10, color: TextTheme.normal.color }} />
      <Text style={[TextTheme.headingThree, { flexShrink: 1 }]}>{title}</Text>
    </View>
  )

  const SectionRow: React.FC<{
    title: string
    value?: string
    accessibilityLabel?: string
    testID?: string
    onPress?: GenericFn
  }> = ({ title, value, accessibilityLabel, testID, onPress }) => (
    <View style={[styles.section]}>
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        style={styles.sectionRow}
        onPress={onPress}
      >
        <Text style={[TextTheme.headingFour, { fontWeight: 'normal' }]}>{title}</Text>
        <Text style={[TextTheme.headingFour, { fontWeight: 'normal', color: ColorPallet.brand.link }]}>{value}</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <SectionList
          renderItem={({ item: { title, value, onPress } }) => (
            <SectionRow
              title={title}
              accessibilityLabel={title}
              testID={testIdWithKey(title)}
              value={value}
              onPress={onPress}
            />
          )}
          renderSectionHeader={({
            section: {
              header: { title, icon },
            },
          }) => <SectionHeader icon={icon} title={title} />}
          ItemSeparatorComponent={() => (
            <View style={{ backgroundColor: SettingsTheme.groupBackground }}>
              <View style={[styles.itemSeparator]}></View>
            </View>
          )}
          SectionSeparatorComponent={() => <View style={[styles.sectionSeparator]}></View>}
          ListFooterComponent={() => (
            <View style={styles.footer}>
              <TouchableWithoutFeedback onPress={incrementDeveloperMenuCounter} disabled={developerModeTriggerDisabled}>
                <View>
                  <Text style={TextTheme.normal} testID={testIdWithKey('Version')}>
                    {`${t('Settings.Version')} ${getVersion()} ${t('Settings.Build')} (${getBuildNumber()})`}
                  </Text>
                  <Assets.svg.logo {...styles.logo} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
          sections={settingsSections}
        ></SectionList>
        <View>
          <Modal visible={modalOpen}>
            <Text
              style={{
                alignContent: 'center',
                backgroundColor: 'black',
                color: 'white',
                marginTop: 20,
                padding: 40,
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 24,
              }}
            >
              Please Enter The Secret Key with 16 character:
            </Text>
            <TextInput
              placeholder={'Secret Key'}
              onChangeText={(e) => setPass(e)}
              style={{ backgroundColor: 'green', marginTop: 2, padding: 20, fontSize: 18, opacity: 0.8 }}
            ></TextInput>
            {pass.length === 16 ? (
              <Button title="Submit" onPress={() => handleBackUp()} />
            ) : (
              <Button title="Submit" disabled onPress={() => handleBackUp()} />
            )}
          </Modal>
          <Modal visible={modalOpenRes}>
            <Text
              style={{
                alignContent: 'center',
                backgroundColor: 'black',
                color: 'white',
                marginTop: 20,
                padding: 40,
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 24,
              }}
            >
              Please Enter The Secret Key with 16 character:
            </Text>
            <TextInput
              placeholder={'Secret Key'}
              onChangeText={(e) => setResPass(e)}
              style={{ backgroundColor: 'green', marginTop: 2, padding: 20, fontSize: 18, opacity: 0.8 }}
            ></TextInput>
            {resPass.length === 16 ? (
              <Button title="Submit" onPress={() => handleRestorePass()} />
            ) : (
              <Button title="Submit" disabled onPress={() => handleRestorePass()} />
            )}
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Settings
