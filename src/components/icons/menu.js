export default function Menu_icon({ color, type }) {
    if (type === 'menu') {
        return <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1H19" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3 6H17" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 11H14" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    } else if (type === 'close') {
        return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 13L13 1" stroke="white" stroke-width="1.5" strokeMiterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13 13L1 1" stroke="white" stroke-width="1.5" strokeMiterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    } else if (type === 'arrow') {

    } else if (type === 'edit') {
        return <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.83253 12.3801C6.84755 13.3853 3.51376 13.4753 3.27451 13.1969C3.03526 12.9186 3.14315 9.67047 4.12046 8.66779C5.09777 7.66511 7.28869 5.49418 9.18237 3.60558C11.8821 0.90574 15.5941 4.61803 12.8944 7.31786C11.0008 9.20647 8.81751 11.3749 7.83253 12.3801Z" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.83325 4.33334L11.8333 7.33334" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.83325 13.3333H13.1666" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    } else if (type === 'chat') {
        return <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 10C1 15 5 19 10 19C12.1 19 14.1 18.2 15.6 17H19.6988C19.8418 17 19.9386 16.8542 19.8831 16.7224L18.4 13.2C18.8 12.2 19 11.1 19 10C19 5 15 1 10 1C5 1 1 5 1 10Z" stroke={color} strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="6" cy="10.5" r="0.5" fill={color} stroke={color} strokeWidth="1.25" />
            <circle cx="10" cy="10.5" r="0.5" fill={color} stroke={color} strokeWidth="1.25" />
            <circle cx="14" cy="10.5" r="0.5" fill={color} stroke={color} strokeWidth="1.25" />
        </svg>
    } else if (type === 'close__message'){
        return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 13L13 1" stroke={color} stroke-width="1.5" strokeMiterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M13 13L1 1" stroke={color} stroke-width="1.5" strokeMiterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    } else {
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 7L10 12L15 17" stroke={color} strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    }

}
