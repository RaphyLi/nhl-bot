export const getToday = function () {
    const today = new Date();

    return formatDate(today);
}

export const getYesterday = function () {
    const today = new Date();
    const yesterday = new Date(today.setDate(new Date().getDate() - 1));

    return formatDate(yesterday);
}

const formatDate = function (date: Date) {
    let dd: string | number = date.getDate();
    let mm: string | number = date.getMonth() + 1;
    const year = date.getFullYear();

    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;

    return [year, mm, dd].join('-');
}
