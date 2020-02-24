"use strict";
/* eslint-disable no-console */

const PeerId = require("peer-id");
const PeerInfo = require("peer-info");
const Node = require("./libp2p_bundle");
const pull = require("pull-stream");
const Pushable = require("pull-pushable");
const p = Pushable();
const chalk = require("chalk");
const emoji = require("node-emoji");

PeerId.createFromJSON(require("./ids/moonId"), (err, peerId) => {
    console.log("hello");
    if (err) {
        throw err;
    }
    const peerInfo = new PeerInfo(peerId);
    peerInfo.multiaddrs.add("/ip4/127.0.0.1/tcp/10333");
    const nodeListener = new Node({ peerInfo });

    nodeListener.start(err => {
        if (err) {
            throw err;
        }

        nodeListener.on("peer:connect", peerInfo => {
            console.log(
                emoji.get("moon"),
                chalk.blue(" Moon found Earth "),
                emoji.get("large_blue_circle"),
                chalk.blue(` on: ${peerInfo.id.toB58String()}`)
            );
            console.log(
                "\n" + emoji.get("moon"),
                chalk.green(" Moon waiting for message from Earth ") +
                    emoji.get("large_blue_circle")
            );
        });

        nodeListener.handle("/propose/1.0.0", (protocol, conn) => {
            // link p pushable, to this connection
            pull(p, conn);

            // handle data from earth
            pull(
                conn,
                pull.map(data => {
                    return data.toString("utf8").replace("\n", "");
                }),
                pull.drain(data => {
                    if (data == "Proposal") {
                        console.log("Proposal received");
                        // gotta add reject()
                        accept();
                    } else if (data == "done") {
                        console.log("Invest done!");
                    } else {
                        console.log("Invalid response XXX");
                    }
                })
            );

            function accept() {
                const data = "Accept";
                p.push(data);
            }
        });

        console.log(
            emoji.get("moon"),
            chalk.blue(" Moon ready "),
            emoji.get("headphones"),
            chalk.blue(" Listening on: ")
        );

        peerInfo.multiaddrs.forEach(ma => {
            console.log(ma.toString() + "/p2p/" + peerId.toB58String());
        });

        console.log(
            "\n" + emoji.get("moon"),
            chalk.blue(" Moon trying to connect with Earth "),
            emoji.get("large_blue_circle")
        );
    });
});
