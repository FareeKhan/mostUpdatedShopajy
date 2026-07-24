import { StyleSheet, View } from 'react-native'
import React from 'react'
import DirhimIcon from '../assets/svg/dirhm.svg'
import RedDirham from '../assets/svg/redDirham.svg'
const DirhamSymbol = ({ size = 15, top = 0, red }) => {
    return (
        <View >
            {
                red ?
                    <RedDirham height={size} width={size} style={{ top: top }} />
                    :
                    <DirhimIcon height={size} width={size} style={{ top: top }} />
            }
        </View>
    )
}

export default DirhamSymbol

const styles = StyleSheet.create({})