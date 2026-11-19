export function getAge(birthDate: Date, today: Date): number {
  const age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth()
    || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  return hadBirthdayThisYear ? age : age - 1;
}
