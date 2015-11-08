<?php

/**
 *
 * ZPanel - A Cross-Platform Open-Source Web Hosting Control panel.
 *
 * @package ZPanel
 * @version $Id$
 * @author Bobby Allen - ballen@bobbyallen.me
 * @copyright (c) 2008-2014 ZPanel Group - http://www.zpanelcp.com/
 * @license http://opensource.org/licenses/gpl-3.0.html GNU Public License v3
 *
 * This program (ZPanel) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
class module_controller extends ctrl_module
{

    static public function getServices()
    {
        global $controller;
        $line = "<h2>" . ui_language::translate("Checking status of services...") . "</h2>";
        $line .= "<table>";
        $line .= "<tr>";
        $line .= "<th>HTTP</th>";
        $line .= "<td>";

        if (fs_director::CheckForEmptyValue(sys_monitoring::PortStatus(80))) {
            $line .= "<img src=\"modules/" . $controller->GetControllerRequest('URL', 'module') . "/assets/down.gif\">";
        } else {
            $line .= "<img src=\"modules/" . $controller->GetControllerRequest('URL', 'module') . "/assets/up.gif\">";
        }

        $line .= "</td>";
        $line .= "</tr>";
        $line .= "<tr>";
        $line .= "<th>FTP</th>";
        $line .= "<td>";

        if (fs_director::CheckForEmptyValue(sys_monitoring::PortStatus(21))) {
            $line .= "<img src=\"modules/" . $controller->GetControllerRequest('URL', 'module') . "/assets/down.gif\">";
        } else {
            $line .= "<img src=\"modules/" . $controller->GetControllerRequest('URL', 'module') . "/assets/up.gif\">";
        }

        $line .= "</td>";
        $line .= "</tr>";
        $line .= "<tr>";
        $line .= "<th>MySQL</th>";
        $line .= "<td>";
        /* MySQL has to be on-line as you are viewing this page, we made this 'static' to save on port queries (saves time) amongst other reasons. */
        $line .= "<img src=\"modules/" . $controller->GetControllerRequest('URL', 'module') . "/assets/up.gif\">";

        $line .= "</td>";
        $line .= "</tr>";
        $line .= "</table>";
        $line .= "<br><h2>" . ui_language::translate("Server Uptime") . "</h2>";
        $line .= ui_language::translate("Uptime") . ": " . sys_monitoring::ServerUptime();
        return $line;
    }

    static function getIsWebServerUp()
    {
        return sys_monitoring::PortStatus(80);
    }

    static function getIsMySQLUp()
    {
        return sys_monitoring::PortStatus(3306);
    }

    static function getIsFTPUp()
    {
        return sys_monitoring::PortStatus(21);
    }

    static function getUptime()
    {
        return sys_monitoring::ServerUptime();
    }

    static function getLastRunTime()
    {
        return date(ctrl_options::GetSystemOption('zpanel_df'), ctrl_options::GetSystemOption('daemon_lastrun'));
    }

    static function getNextRunTime()
    {
        $new_time = ctrl_options::GetSystemOption('daemon_lastrun') + ctrl_options::GetSystemOption('daemon_run_interval');
        return date(ctrl_options::GetSystemOption('zpanel_df'), $new_time);
    }

}
