import { Icon, IconElement, IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';
import { selectAccount } from '../reducers/user';
import { useDispatch, useSelector } from "react-redux";
import {StyleSheet} from "react-native";


export default function SelectAccount() {

    const dispatch = useDispatch();
    const accounts = useSelector((state) => state.user.value.user.accounts);
    const selectedAccount = useSelector((state) => state.user.value.selectedAccount);

    const EditIcon = (props) => (
        <Icon
            {...props}
            name='edit-outline'
        />
    );

    return (
        <Select
            placeholder='Compte'
            selectedIndex={selectedAccount}
            onSelect={index => dispatch(selectAccount(index))}
        >
            {accounts.map((option, index) => (
                <SelectItem key={index}
                    title={option.name}
                />
            ))}
        </Select>
    )
}

//CSS à revoir
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
    },
});

