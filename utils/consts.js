
export function presentableWord(dataWord) {
    return dataWord.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}