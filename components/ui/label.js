import { cx } from "@utils/all";

export default function Label(props) {
  const color = {
    green: "text-emerald-700 dark:text-emerald-600",
    blue: "text-blue-700 dark:text-blue-600",
    orange: "text-orange-700 dark:text-orange-600",
    purple: "text-purple-700 dark:text-purple-600",
    pink: "text-pink-700 dark:text-pink-600"
  };
  return (
    <span
      className={cx(
        "inline-block mt-5 text-xs font-medium tracking-wider uppercase ",
        color[props.color] || color[pink]
      )}>
      {props.children}
    </span>
  );
}
