export const toCurrencyString = (number: number) => {
    let formatter = new Intl.NumberFormat('en-US', {
      style: "currency",
      currency: "PHP"
    })

    return formatter.format(number)

  }