import { Icon, IconElement, IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';
import { selectAccount } from '../reducers/user';
import { useDispatch, useSelector } from "react-redux";
import {StyleSheet} from "react-native";
import iconsMap from "../assets/iconsMap";

export default function SelectAccount() {

    const dispatch = useDispatch();
    const accounts = useSelector((state) => state.user.value.user.accounts);
    const selectedAccount = useSelector((state) => state.user.value.selectedAccount);

    const renderAccessory = (iconName) => (props) => (
        <Icon {...props} name={iconsMap[iconName]} />
      );

    return (
        <Select
        style={styles.container}
            value={accounts[selectedAccount].name}
            selectedIndex={new IndexPath(selectedAccount)}
            accessoryLeft={renderAccessory(accounts[selectedAccount].icon)}
            onSelect={index => dispatch(selectAccount(index.row))}
        >
            {accounts.map((option, index) => (
                <SelectItem key={index}
                    title={option.name}
                    accessoryLeft={renderAccessory(option.icon)}
                />
            ))}
        </Select>
    )
}

//CSS à revoir
const styles = StyleSheet.create({
    
container: {
    width: 344,
    },
});

